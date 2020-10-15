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
        if (_.get(data, 'direction') === 'outbound') {
            return;
        }

        const callStatus = _.get(data, 'status');
        if (!callStatus) {
            throw new BadRequestError('invalid request');
        }

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
            const infoObject = { ...createdCall };
            infoObject.callInitiation = callInitiation;
            infoObject.caller = caller;
            ongoingCallService.addNewCall(infoObject);

            await t.commit();
        } catch (e) {
            console.log(e);
            await t.rollback();
            throw e;
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

                let destination = await db.callDestination.findOne({ where: { accountNumber: data.destination.targets[0].account_number } });
                if (!destination) {
                    destination = await db.callDestination.create({ accountNumber: _.get(data, 'destination.targets[0].account_number') });
                }

                ringingData.callId = callId;
                ringingData.destinationId = destination.id;

                await db.callRinging.create(ringingData, { transaction: t });
            } else if (data.status === 'in-progress') {
                const callPickupData = { callId };
                await db.callPickup.create(callPickupData, { transaction: t });
            }
            await t.commit();
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    }

    async endCall(data) {
        const callId = _.get(data, 'call_id');

        const callEndingData = { callId };

        const keyEndedReason = await db.keyEndedReason.findOne({ where: { reason: data.reason } });

        callEndingData.keyEndedReasonId = keyEndedReason.id;
        callEndingData.callEndingTime = db.sequelize.literal('CURRENT_TIMESTAMP');

        await db.sequelize.transaction(async (t) => {
            try {
                await db.callEnding.create(callEndingData, { transaction: t });
            } catch (e) {
                throw e;
            }
        });

        if (_.get(data, 'destination.number') === process.env.HOTLINE2_NUMBER) {
            hailHotlineService.removeCall(callId);
            event.emit('hailQueueUpdate');
        }

        if (_.get(data, 'destination.number') === process.env.HOTLINE1_NUMBER) {
            mainQueue.removeCall(callId);
            event.emit('mainQueueUpdate');
        }

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
     */
    async writeCaller(data, t) {
        const writeData = {};

        writeData.phoneNumber = _.get(data, 'caller.number');

        const existingCaller = await db.caller.findOne({ where: { phoneNumber: writeData.phoneNumber } });

        if (existingCaller) {
            existingCaller.lastContactDate = db.sequelize.literal('CURRENT_TIMESTAMP');
            await existingCaller.save();
            return existingCaller;
        }
        const newCaller = await db.caller.create(writeData, { transaction: t });
        return newCaller;
    }
}

module.exports = CallProcessingController;