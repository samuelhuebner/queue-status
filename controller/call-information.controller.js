const { _ } = require('lodash');
const moment = require('moment');
const { Op } = require('sequelize');
const db = require('../models');

class CallInformationController {
    getInboundCallNumber(startDate, endDate) {
        let date;
        let firstDay;
        let y;
        let m;

        if (!startDate) {
            date = new Date();
            y = date.getFullYear();
            m = date.getMonth();
            firstDay = new Date(y, m, 1);
        } else {
            date = startDate;
            y = date.getFullYear();
            m = date.getMonth();

            firstDay = new Date(y, m, date.getDate());
        }

        const lastDay = endDate || new Date(y, m + 1, 0);

        return db.callInitiation.count({
            where: {
                callInitiationTime: {
                    [Op.between]: [firstDay, lastDay]
                }
            }
        });
    }

    /**
     * Gets call Destinations related to a user if a contact iD is specified. Otherwise all destinations are returned
     *
     * @param {number} contactId
     */
    async getCallDestinations(contactId) {
        if (!contactId) {
            return db.callDestination.findAll();
        }

        return db.callDestination.findAll({ where: { contactId } });
    }

    /**
     * This function gets all calls from the database which lay inbetween the given start and end Date
     * If no Date is specified the current Date is initialized as the search parameter
     * @param {Date} startDate
     * @param {Date} endDate
     */
    async getCalls(startDate = new Date(), endDate = new Date()) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 59);

        try {
            const calls = await db.call.findAll({
                include: [
                    {
                        model: db.callInitiation,
                        where: { callInitiationTime: { [Op.between]: [startDate, endDate] } }
                    },
                    { model: db.callRinging, include: [db.callDestination] },
                    { model: db.callEnding, include: [db.keyEndedReason] },
                    db.callPickup,
                    db.caller
                ],
                order: [
                    [{ model: db.callInitiation }, 'callInitiationTime', 'DESC']
                ]
            });

            const filtered = calls.filter((call) => call.callEnding);

            filtered.forEach((item, index) => {
                filtered[index] = this.processCall(item.toJSON());
            });
            return filtered;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    processCall(call) {
        const reason = _.get(call, 'callEnding.keyEndedReason.reason');

        switch (reason) {
            case 'completed':
                if (call.callRinging) {
                    call.endingReason = reason;
                    break;
                }

                call.endingReason = 'no-answer';
                break;
            default:
                call.endingReason = reason;
                break;
        }

        if (call.callRinging && call.callPickup) {
            call.callRingingTime = this
                .getTimeDifference(
                    call.callRinging.callRingingTime,
                    call.callPickup.callPickupTime
                );
        } else if (call.callRinging) {
            call.callRingingTime = this
                .getTimeDifference(
                    call.callRinging.callRingingTime,
                    call.callEnding.callEndingTime
                );
        }

        if (call.callPickup) {
            call.callTalkingTime = this
                .getTimeDifference(
                    call.callPickup.callPickupTime,
                    call.callEnding.callEndingTime
                );
        }

        return call;
    }

    /**
     * Gets the time difference of two Dates and returns a String in the format 'HH:MM:SS'
     * @param {Date} dateTo
     * @param {Date} dateFrom
     * @returns {String}
     */
    getTimeDifference(dateFrom, dateTo) {
        const start = moment(dateFrom);
        const end = moment(dateTo);
        const duration = moment.duration(end.diff(start));
        const differenceInTime = moment(end.diff(start)).format('mm:ss');
        const hours = Math.floor(duration.asHours());

        return `0${hours}:${differenceInTime}`;
    }

    async getReachability(start = new Date(), end = new Date()) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 59);

        const calls = await this.getCalls(start, end);

        const callCount = calls.length;
        let successfulCalls = 0;

        calls.forEach((call) => {
            const processedCall = this.processCall(call);

            if (processedCall.endingReason === 'completed') {
                successfulCalls += 1;
            }
        });

        return [
            {
                name: 'successful',
                value: successfulCalls
            },
            {
                name: 'unsuccessful',
                value: callCount - successfulCalls
            }
        ];
    }
}

module.exports = CallInformationController;
