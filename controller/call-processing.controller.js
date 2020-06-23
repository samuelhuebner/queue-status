const _ = require('lodash');
const db = require('../models');
const event = require('../services/event.service');
const hailQueue = require('../services/hail-hotline.service');

const { NotFoundError, BadRequestError } = require('../errors');
const hailHotlineService = require('../services/hail-hotline.service');

class CallProcessingController {
    async determineCallStatus(data) {
        console.log(data);

        if (_.get(data, 'direction') === 'outbound') {
            return;
        }

        const callStatus = _.get(data, 'status');
        if (!callStatus) {
            throw new BadRequestError('invalid request');
        }

        if (callStatus === 'created') {
            
            if (process.env.DEBUG) {
                console.log('registering new call');
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
            callData.callerId = await this.writeCaller(data, t);

            const callId = _.get(data, 'call_id');

            callData.callId = callId;
            callData.calledNumber = _.get(data, 'destination.number');
            callInitData.callId = callId;
            callInitData.callInitiationTime = _.get(data, 'timestamp');

            if (callData.calledNumber === process.env.HOTLINE_NUMBER) {
                hailQueue.addNewCall(callId);
                event.emit('queueUpdate');
            }

            const callInitiation = await db.callInitiation.create(callInitData, { transaction: t });
            callData.callInitiationId = callInitiation.id;

            await db.call.create(callData, { transaction: t });
            await t.commit();
        } catch (e) {
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
                if (data.destination.number === process.env.HOTLINE_NUMBER) {
                    hailQueue.removeCall(callId);
                    event.emit('queueUpdate');
                }
                
                let destination = await db.callDestination.findOne({ where: { accountNumber: data.destination.targets[0].account_number } });
                if (!destination) {
                    destination = await db.callDestination.create({ accountNumber: data.destination.targets[0].account_number });
                }

                ringingData.callId = callId;
                ringingData.destinationId = destination.id;

                await db.callRinging.create(ringingData, { transaction: t });
            } else if (data.status === 'in-progress') {
                const callPickupData = { callId }
                await db.callPickup.create(callPickupData, { transaction: t });
            }
            await t.commit();
        } catch (e) {
            await t.rollback();
            console.error(e);
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

        if (_.get(data, 'destination.number') === process.env.HOTLINE_NUMBER) {
            hailHotlineService.removeCall(callId);
            event.emit('queueUpdate');
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
            db.call.findOne({ where: { callId }}),
            db.callRinging.findOne({ where: { callId }}),
            db.callPickup.findOne({ where: { callId }}),
            db.callEnding.findOne({ where: { callId }})
        ]);

        call.callRingingId = _.get(callRinging, 'id');
        call.callPickupId = _.get(callPickup, 'id');
        call.callEndingId = _.get(callEnding, 'id');

        const keyEndedReasonId = _.get(callEnding, 'keyEndedReasonId'); 
        if (keyEndedReasonId === 1) {
            call.wasSuccessful = 1
        }

        await call.save();
    }


    async writeCaller(data, t) {
        const writeData = {};

        writeData.phoneNumber = _.get(data, 'caller.number');

        const existingCaller = await db.caller.findOne({ where: { phoneNumber: writeData.phoneNumber } });

        if (existingCaller) {
            existingCaller.lastContactDate = db.sequelize.literal('CURRENT_TIMESTAMP');
            await existingCaller.save();
            return existingCaller.id;
        } else {
            const newCaller = await db.caller.create(writeData, { transaction: t });
            return newCaller.id;
        }
    }
}

module.exports = CallProcessingController;