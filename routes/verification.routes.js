const { Router } = require('express');
const _ = require('lodash');

const verifyService = require('../services/verify.service');

class VerificationRoutes {
    constructor() {
        this.router = new Router();
        this.router.get('/user', this.verifyUser.bind(this));
    }

    async verifyUser(req, res, next) {
        const secret = _.get(req, 'query.secret');
        verifyService.verifyUser(secret)
            .then((result) => res.send(result))
            .catch((error) => next(error));
    }
}

module.exports = {
    url: '/verify',
    router: new VerificationRoutes().router
};