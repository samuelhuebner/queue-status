const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');

const { AuthenticationError, BadRequestError } = require('../errors');
const emailService = require('./email.service');

const models = require('../models');
const { sequelize } = require('../models');

class AuthService {
    /**
     *
     * @param {string} username
     * @param {string} password
     * @param {Object} data
     */
    async signUp(username, password, data) {
        const hashedPassword = await argon2.hash(password);
        const verificationToken = cryptoRandomString({ length: 30, type: 'url-safe' });

        const domain = username.split('@');
        if (domain.length !== 2) {
            throw new BadRequestError('Invalid E-Mail Address');
        }

        const allowedDomains = await models.keyAllowedDomain.findAll();

        let validDomain = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const allowedDomain of allowedDomains) {
            if (domain === allowedDomain.domainName) {
                validDomain = true;
            }
        }

        if (!validDomain) {
            throw new BadRequestError('Not allowed domain');
        }

        const userData = {
            username,
            password: hashedPassword,
            name: _.get(data, 'name'),
            email: _.get(data, 'email') || username,
            validationToken: verificationToken
        };

        const t = await sequelize.transaction();
        try {
            const newUser = await models.user.create(userData, { transaction: t });

            const options = {
                rawContent: `Hello from calls.pdr-team.de!
Here is your verification Link for your new account:
${process.env.APP_URL}/verify/user?userId=${newUser.id}&token=${verificationToken}`,
                subject: 'Please verify your account',
                recipient: newUser.email
            };

            await emailService
                .sendMail(options.rawContent, undefined, options.subject, options.recipient);

            await t.commit();
            return {
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    name: newUser.name
                }
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async login(username, password) {
        const userRecord = await models
            .user
            .findOne({ where: { username } });

        if (!userRecord) {
            throw new AuthenticationError('User not found!');
        }

        if (!userRecord.isValidated) {
            throw new AuthenticationError('User not authenticated');
        }

        const isCorrectPassword = await argon2.verify(userRecord.password, password);
        if (!isCorrectPassword) {
            throw new AuthenticationError('Invalid password!');
        }

        return {
            user: {
                id: userRecord.id,
                username: userRecord.username,
                name: userRecord.name
            },
            token: this.generateJWT(userRecord)
        };
    }

    generateJWT(userData) {
        const data = {
            id: userData.id,
            username: userData.username,
            email: userData.email
        };

        const signature = process.env.JWT_SECRET;
        const duration = '7 days';

        return jwt.sign({ data }, signature, { expiresIn: duration });
    }
}

module.exports = new AuthService();