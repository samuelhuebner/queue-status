const db = require('../models');
const { Op } = require('sequelize');

class CallInformationController {

    getInboundCallNumberMonth() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

        return db.callInitiation.count({
            where: {
                callInitiationTime: {
                    [Op.between]: [firstDay, lastDay] 
                }
            }
        });
    }

}

module.exports = CallInformationController;