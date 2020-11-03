const { Router } = require('express');
// const _ = require('lodash');

const AdminController = require('../controller/admin.controller');

class AdminRoutes {
    constructor() {
        this.router = new Router();
        this.controller = new AdminController();
        this.router.get('/users', this.getUsers.bind(this));
        // this.router.post('/signup', this.createUser.bind(this));
    }

    async getUsers(req, res, next) {
        this.controller.getAllUsers()
            .then((result) => res.send(result))
            .catch((e) => next(e));
    }
    // async authenticateUser(req, res, next) {
    //     const username = _.get(req, 'body.username');
    //     const password = _.get(req, 'body.password');
    //     authService.login(username, password)
    //         .then((result) => res.send(result))
    //         .catch((error) => next(error));
    // }

    // async createUser(req, res, next) {
    //     const username = _.get(req, 'body.username');
    //     const password = _.get(req, 'body.password');
    //     authService.signUp(username, password, req.body)
    //         .then((result) => res.send(result))
    //         .catch((error) => next(error));
    // }
}

module.exports = {
    url: '/api/admin',
    router: new AdminRoutes().router
};