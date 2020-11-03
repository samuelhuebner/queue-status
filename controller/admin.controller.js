const db = require('../models');

module.exports = class AdminController {
    async getAllUsers() {
        return db.user.findAll({
            attributes: { exclude: ['password', 'validationToken'] }
        });
    }
};