/* eslint-disable max-len */
const _ = require('lodash');
const db = require('../models');
const event = require('../services/event.service');
const hailQueue = require('../services/hail-hotline.service');
const mainQueue = require('../services/main-hotline.service');
const ongoingCallService = require('../services/ongoing-call.service');

const { BadRequestError } = require('../errors');
const hailHotlineService = require('../services/hail-hotline.service');

class CallProcessingController {
    async determineCallStatus(data) {
        const callStatus = _.get(data, 'status');
        const direction = _.get(data, 'direction');

        if (!callStatus) {
            throw new BadRequestError('invalid request');
        }

        if (direction === 'inbound') {
            if (callStatus === 'created') {
                if (Number.parseInt(process.env.DEBUG)) {
                    console.log(data);
                    console.log('-----------------------------------------------------------------------------------------');
                    console.log(`registering new inbound call with id ${_.get(data, 'call_id')}`);
                }
                await this.registerNewCall(data);
            } else if (callStatus === 'ringing' || callStatus === 'in-progress') {
                await this.updateCall(data);
            } else if (callStatus === 'ended') {
                await this.endCall(data);
            }
        } else if (direction) {
            if (callStatus === 'ringing') {
                if (Number.parseInt(process.env.DEBUG)) {
                    console.log(data);
                    console.log('-----------------------------------------------------------------------------------------');
                    console.log(`registering new outbound call with id ${_.get(data, 'call_id')}`);
                }

                await this.registerNewOutboundCall(data);
            } else if (callStatus === 'in-progress') {
                await this.updateOutboundCall(data);
            } else if (callStatus === 'ended') {
                await this.endCall(data);
            }
        }
    }

    async updateOutboundCall(data) {
        const callId = _.get(data, 'call_id');
        const callPickupData = { callId };

        const callData = {
            callId,
            callStatus: 'in-progress'
        };

        const t = await db.sequelize.transaction();
        try {
            const pickupObject = await db.callPickup.create(callPickupData, { transaction: t });
            callData.callPickup = pickupObject.toJSON();
            callData.callPickup.callPickupTime = _.get(data, 'timestamp');

            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }

        ongoingCallService.processCall(callData);
    }

    async registerNewOutboundCall(data) {
        const callInitData = {};
        const callRingingData = {};
        const callData = {};

        const t = await db.sequelize.transaction();

        try {
            const caller = await this.writeCaller(data, t, true);
            callData.callerId = caller.id;

            // gets callId from call-request
            const callId = _.get(data, 'call_id');
            callData.callId = callId;
            callInitData.callId = callId;
            callRingingData.callId = callId;

            callData.calledNumber = _.get(data, 'destination.targets[0].number') || _.get(data, 'destination.number');
            callData.callDirection = _.get(data, 'direction');

            callInitData.callInitiationTime = _.get(data, 'timestamp');
            callRingingData.callRingingTime = _.get(data, 'timestamp');

            const callDestinationData = {
                accountNumber: _.get(data, 'destination.targets[0].account_number'),
                userName: _.get(data, 'destination.targets[0].name'),
                number: _.get(data, 'destination.targets[0].number') || _.get(data, 'destination.number')
            };

            if (_.get(data, 'destination.targets[0].account_number')) {
                callDestinationData.isExternal = 0;
            }

            const callDestination = await db
                .callDestination.create(callDestinationData, t);

            callRingingData.destinationId = callDestination.id;
            // creates corresponding objects in the database
            const [
                callInitiation,
                callRinging
            ] = await Promise.all([
                db.callInitiation.create(callInitData, { transaction: t }),
                db.callRinging.create(callRingingData, { transaction: t })
            ]);
            callData.callInitiationId = callInitiation.id;
            callData.callRingingId = callRinging.id;

            const createdCall = await db.call.create(callData, { transaction: t });

            // creates an info object from the callData and
            const jsonCall = createdCall.toJSON();
            const infoObject = { ...jsonCall };
            infoObject.callInitiation = callInitiation.toJSON();
            infoObject.callRinging = callRinging.toJSON();
            infoObject.callInitiation.callInitiationTime = _.get(data, 'timestamp');
            infoObject.callRinging.callRingingTime = _.get(data, 'timestamp');
            infoObject.caller = caller.toJSON();
            infoObject.callStatus = 'ringing';

            ongoingCallService.processCall(infoObject);

            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async registerNewCall(data) {
        const callInitData = {};
        const callData = {};

        const t = await db.sequelize.transaction();

        try {
            // writes caller entity of call
            const caller = await this.writeCaller(data, t);
            callData.callerId = caller.id;

            // gets callId from call-request
            const callId = _.get(data, 'call_id');
            callData.callId = callId;
            callInitData.callId = callId;

            callData.calledNumber = _.get(data, 'destination.number');
            callData.callDirection = _.get(data, 'direction');

            // sets callinitiationTime to the time specified in the request
            callInitData.callInitiationTime = _.get(data, 'timestamp');

            // if call-dest. is part of an hotline the according hotline needs to be updated
            if (callData.calledNumber === process.env.HOTLINE2_NUMBER) {
                hailQueue.addNewCall(callId);
                event.emit('hailQueueUpdate');
            } else if (callData.calledNumber === process.env.HOTLINE1_NUMBER) {
                mainQueue.addNewCall(callId);
                event.emit('mainQueueUpdate');
            }

            // creates corresponding callInitiation object in the database
            const callInitiation = await db.callInitiation.create(callInitData, { transaction: t });
            callData.callInitiationId = callInitiation.id;

            const createdCall = await db.call.create(callData, { transaction: t });

            // creates an info object from the callData and
            const jsonCall = createdCall.toJSON();
            const infoObject = { ...jsonCall };
            infoObject.callInitiation = callInitiation.toJSON();
            infoObject.callInitiation.callInitiationTime = _.get(data, 'timestamp');
            infoObject.caller = caller.toJSON();
            infoObject.callStatus = 'initialized';

            ongoingCallService.processCall(infoObject);

            await t.commit();
        } catch (err) {
            if (process.env.DEBUG) {
                console.log(err);
            }

            await t.rollback();
            throw err;
        }
    }

    async updateCall(data) {
        const callId = _.get(data, 'call_id');
        const t = await db.sequelize.transaction();

        try {
            if (data.status === 'ringing') {
                const ringingData = {};

                if (data.destination.number === process.env.HOTLINE2_NUMBER) {
                    hailQueue.removeCall(callId);
                    event.emit('hailQueueUpdate');
                }

                if (data.destination.number === process.env.HOTLINE1_NUMBER) {
                    mainQueue.removeCall(callId);
                    event.emit('mainQueueUpdate');
                }

                let destination = await db.callDestination.findOne({ where: { accountNumber: _.get(data, 'destination.targets[0].account_number') } });
                if (!destination) {
                    const destinationData = {
                        accountNumber: _.get(data, 'destination.targets[0].account_number'),
                        userName: _.get(data, 'destination.targets[0].name'),
                        number: _.get(data, 'destination.targets[0].number') || _.get(data, 'destination.number')
                    };

                    destination = await db.callDestination.create(destinationData, t);
                }

                ringingData.callId = callId;
                ringingData.destinationId = destination.id;

                const newRingObject = await db.callRinging.create(ringingData, { transaction: t });

                const callData = {
                    callId,
                    callStatus: 'ringing',
                    destination: destination.toJSON()
                };
                callData.callRinging = newRingObject.toJSON();
                ongoingCallService.processCall(callData);
            } else if (data.status === 'in-progress') {
                const callPickupData = { callId };
                const pickupObject = await db.callPickup.create(callPickupData, { transaction: t });

                const callData = {
                    callId,
                    callStatus: 'in-progress'
                };
                callData.callPickup = pickupObject.toJSON();
                callData.callPickup.callPickupTime = _.get(data, 'timestamp');
                ongoingCallService.processCall(callData);
            }
            await t.commit();
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    }

    async endCall(data, isOutbound) {
        const callId = _.get(data, 'call_id');

        const callEndingData = { callId };

        const keyEndedReason = await db.keyEndedReason.findOne({ where: { reason: data.reason } });

        callEndingData.keyEndedReasonId = keyEndedReason.id;
        callEndingData.callEndingTime = _.get(data, 'timestamp');

        if (!isOutbound) {
            if (_.get(data, 'destination.number') === process.env.HOTLINE2_NUMBER) {
                hailHotlineService.removeCall(callId);
                event.emit('hailQueueUpdate');
            }

            if (_.get(data, 'destination.number') === process.env.HOTLINE1_NUMBER) {
                mainQueue.removeCall(callId);
                event.emit('mainQueueUpdate');
            }
        }

        await db.sequelize.transaction(async (t) => {
            await db.callEnding.create(callEndingData, { transaction: t });
        });

        ongoingCallService.removeOngoingCall({ callId });
        return this.processCall(callId);
    }

    async processCall(callId) {
        const [
            call,
            callRinging,
            callPickup,
            callEnding
        ] = await Promise.all([
            db.call.findOne({ where: { callId } }),
            db.callRinging.findOne({ where: { callId } }),
            db.callPickup.findOne({ where: { callId } }),
            db.callEnding.findOne({ where: { callId } })
        ]);

        if (!call) {
            await new Promise((resolve) => setTimeout(() => {
                // eslint-disable-next-line no-unused-expressions
                resolve, 1000;
            }));

            console.log('call not yet existing, waiting for finished transaction');
        }

        call.callRingingId = _.get(callRinging, 'id');
        call.callPickupId = _.get(callPickup, 'id');
        call.callEndingId = _.get(callEnding, 'id');

        const keyEndedReasonId = _.get(callEnding, 'keyEndedReasonId');
        if (keyEndedReasonId === 1) {
            call.wasSuccessful = 1;
        }

        await call.save();
    }

    /**
     * Writes Caller Object to database
     * @param {Object} data
     * @param {Object} t
     * @param {boolean} isOutbound
     */
    async writeCaller(data, t, isOutbound) {
        const writeData = {};

        writeData.phoneNumber = _.get(data, 'caller.number');
        writeData.firstContactDate = _.get(data, 'timestamp');

        if (isOutbound) {
            writeData.isExternal = 0;
        }

        const existingCaller = await db.caller.findOne({ where: { phoneNumber: writeData.phoneNumber } });

        if (existingCaller) {
            existingCaller.lastContactDate = _.get(data, 'timestamp');
            await existingCaller.save();
            return existingCaller;
        }
        const newCaller = await db.caller.create(writeData, { transaction: t });
        return newCaller;
    }
}

module.exports = CallProcessingController;