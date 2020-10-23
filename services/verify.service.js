const cryptoJs = require('crypto-js');
const { NotFoundError, BadRequestError } = require('../errors');
const models = require('../models');

class VerifyService {
    async verifyUser(secret) {
        const decoded = decodeURIComponent(secret);
        const string = this.decrypt(decoded);

        const params = string.split('&');
        const id = params[0].split('=')[1];
        const token = params[1].split('=')[1];

        const parsedId = Number.parseInt(id);
        const user = await models.user.findByPk(parsedId);



        if (!user) {
            throw new NotFoundError();
        }

        if (user.isValidated) {
            return '<p>Already verified! <a href="https://pdr-call-stats.web.app/login">Login here</a></p>';
        }

        if (user.validationToken !== token) {
            throw new BadRequestError();
        }

        await models.user.update({ isValidated: 1 }, { where: { id: parsedId } });

        return '<p>Verification Successful! <a href="https://pdr-call-stats.web.app/login">Login here</a></p>';
    }

    decrypt(cipherText) {
        const decrypt = cryptoJs.AES.decrypt(cipherText, process.env.API_KEY);
        const plainString = decrypt.toString(cryptoJs.enc.Utf8);

        return plainString;
    }
}

module.exports = new VerifyService();