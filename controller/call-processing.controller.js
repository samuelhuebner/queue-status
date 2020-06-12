const _ = require('lodash');
const db = require('../models');

const { NotFoundError, BadRequestError, FailedTransactionError } = require('../errors');

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
            await this.registerNewCall(data);
        } else if (callStatus === 'ringing' || callStatus === 'in-progress') {
            await this.updateCall(data);
        } else if (callStatus === 'ended') {
            await this.endCall(data);
        }
    }


    async registerNewCall(data) {
        const writeData = {};

        const t = await db.sequelize.transaction();

        try {
            writeData.callerId = await this.writeCaller(data, t);
            writeData.callId = _.get(data, 'call_id');
            writeData.callInitiationTime = _.get(data, 'timestamp');
            writeData.calledNumber = _.get(data, 'destination.number');

            if (writeData.calledNumber === process.env.HOTLINE_NUMBER) {
                const updateQueue = await db.queue.findOne({ where: { phoneNumber: process.env.HOTLINE_NUMBER } });
                if (updateQueue) {
                    updateQueue.callsWaiting += 1;
                    await updateQueue.save();
                } else {
                    await db.queue.create({ queueName: process.env.HOTLINE_NAME, phoneNumber: process.env.HOTLINE_NUMBER, callsWaiting: 1 }, { transaction: t });
                }
            }

            await db.call.create(writeData, { transaction: t });
            await t.commit();
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async updateCall(data) {
        const callId = _.get(data, 'call_id');

        
        const t = await db.sequelize.transaction();
        
        const toUpdate = await db.call.findOne({ where: { callId } });

        try {
            if (data.status === 'ringing') {
                if (data.destination.number === process.env.HOTLINE_NUMBER) {
                    const updateQueue = await db.queue.findOne({ where: { phoneNumber: process.env.HOTLINE_NUMBER } });
                    if (!updateQueue || updateQueue.callsWaiting === 0) {
                        return;
                    }
    
                    updateQueue.callsWaiting -= 1;
                    await updateQueue.save({ transaction: t });
                }

                let destination = await db.callDestination.findOne({ where: { accountNumber: data.destination.targets[0].account_number } });
                if (!destination) {
                    destination = await db.callDestination.create({ accountNumber: data.destination.targets[0].account_number });
                }

                toUpdate.destinationId = destination.id;

                await toUpdate.save({ transaction: t });
            } else {
                toUpdate.callPickupTime = db.sequelize.literal('CURRENT_TIMESTAMP');
                await toUpdate.save({ transaction: t });
            }
            await t.commit();
        } catch (e) {
            await t.rollback();
            console.error(e);
        }
    }

    async endCall(data) {
        const callId = _.get(data, 'call_id');
        const toUpdate = await db.call.findOne({ where: { callId } });

        if (!toUpdate) {
            throw new NotFoundError('call not found');
        }

        const keyEndedReason = await db.keyEndedReason.findOne({ where: { reason: data.reason } });
        toUpdate.keyEndedReasonId = keyEndedReason.id;
        toUpdate.callEndingTime = db.sequelize.literal('CURRENT_TIMESTAMP');

        await db.sequelize.transaction(async (t) => {
            try {
                await toUpdate.save({ transaction: t });
            } catch (e) {
                throw e;
            }
        });

        if (_.get(data, 'destination.number') === process.env.HOTLINE_NUMBER) {
            const updateQueue = await db.queue.findOne({ where: { phoneNumber: process.env.HOTLINE_NUMBER } });
            if (!updateQueue || updateQueue.callsWaiting === 0) {
                return;
            }

            updateQueue.callsWaiting -= 1;
            await updateQueue.save();
        }
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