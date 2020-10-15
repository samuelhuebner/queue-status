const { NotFoundError, BadRequestError } = require('../errors');

const models = require('../models');

class VerifyService {
    async verifyUser(userId, token) {
        const parsedId = Number.parseInt(userId);
        const user = await models.user.findByPk(parsedId);

        if (!user) {
            throw new NotFoundError();
        }

        if (user.validationToken !== token) {
            throw new BadRequestError();
        }

        await models.user.update({ isValidated: 1 }, { where: { id: userId } });
    }
}

module.exports = new VerifyService();