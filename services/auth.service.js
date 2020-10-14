const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { AuthenticationError } = require('../errors');

const models = require('../models');

class AuthService {
    async signUp(username, password, data) {
        const hashedPassword = await argon2.hash(password);

        const userData = {
            username,
            password: hashedPassword,
            name: _.get(data, 'name'),
            email: _.get(data, 'email') || username
        };

        const newUser = await models.user.create(userData);

        return {
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name
            }
        };
    }

    async login(username, password) {
        const userRecord = await models.user.findOne({ where: { username } });

        if (!userRecord) {
            throw new AuthenticationError('User not found!');
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