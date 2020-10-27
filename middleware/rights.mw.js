const _ = require('lodash');
const { Op } = require('sequelize');
const { UnauthorizedError } = require('../errors');
const { parseNumber } = require('../utils');
const db = require('../models');

module.exports = async (req, res, next) => {
    if (!_.includes(req.originalUrl, '/api/admin')) {
        next();
        return;
    }

    const userId = _.get(req.headers, 'user-id');
    try {
        const user = await db
            .user
            .findOne({
                where: {
                    [Op.and]: [
                        { id: parseNumber(userId, 'userId') },
                        { isAdmin: 1 }
                    ]
                }
            });
        if (!user) {
            throw new UnauthorizedError('you are not authorized to view this url');
        }
    } catch (error) {
        next(error);
        return;
    }

    next();
};