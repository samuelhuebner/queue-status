const db = require('../models');
const { Op } = require('sequelize');

class CallInformationController {

    getInboundCallNumber(startDate, endDate) {
        var date, firstDay, lastDay, y, m;

        if (!startDate) {
            date = new Date(), y = date.getFullYear(), m = date.getMonth();
            firstDay = new Date(y, m, 1);
        } else {
            date = startDate;
            y = date.getFullYear();
            m = date.getMonth();

            firstDay = new Date(y, m, date.getDate());
        }

        lastDay = endDate || new Date(y, m + 1, 0);

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

        var callInitCount;
        
        const timestring = `${start.getDate()}-${start.getMonth()}-${start.getFullYear()}`
        callInitCount = await db.callInitiation.count({
            where: {
                callInitiationTime: {
                    [Op.between]: [start, end]
                }
            }
        })


        return { calls: callInitCount };
    }

}

module.exports = CallInformationController;