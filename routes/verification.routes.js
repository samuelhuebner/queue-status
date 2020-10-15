const { Router } = require('express');
const _ = require('lodash');

const verifyService = require('../services/verify.service');

class VerificationRoutes {
    constructor() {
        this.router = new Router();
        this.router.get('/user', this.verifyUser.bind(this));
    }

    async verifyUser(req, res, next) {
        const userId = _.get(req, 'query.userId');
        const token = _.get(req, 'query.token');
        verifyService.verifyUser(userId, token)
            .then((result) => res.send(result))
            .catch((error) => next(error));
    }
}

module.exports = {
    url: '/verify',
    router: new VerificationRoutes().router
};