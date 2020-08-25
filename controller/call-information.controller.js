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

    async getReachability(start = new Date(), end = new Date()) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 59);

        const promises = [];

        promises.push(db.callInitiation.count({
            where: {
                callInitiationTime: {
                    [Op.between]: [start, end]
                }
            }
        }));

        promises.push(db.callEnding.count({
            where: {
                keyEndedReasonId: 1
            }
        }));

        const [
            callInitCount,
            successfulCalls
        ] = await Promise.all(promises);

        return {
            callInitCount,
            successfulCalls
        };
    }
}

module.exports = CallInformationController;