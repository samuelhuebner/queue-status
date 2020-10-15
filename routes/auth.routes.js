const { Router } = require('express');
const _ = require('lodash');

const authService = require('../services/auth.service');

class CallRoutes {
    constructor() {
        this.router = new Router();
        this.router.post('/login', this.authenticateUser.bind(this));
        this.router.post('/signup', this.createUser.bind(this));
    }

    async authenticateUser(req, res, next) {
        const username = _.get(req, 'body.username');
        const password = _.get(req, 'body.password');
        authService.login(username, password)
            .then((result) => res.send(result))
            .catch((error) => next(error));
    }

    async createUser(req, res, next) {
        const username = _.get(req, 'body.username');
        const password = _.get(req, 'body.password');
        authService.signUp(username, password, req.body)
            .then((result) => res.send(result))
            .catch((error) => next(error));
    }
}

module.exports = {
    url: '/auth',
    router: new CallRoutes().router
};