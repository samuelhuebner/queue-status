const { Router } = require('express');

const { CallProcessingController } = require('../controller');

class CallRoutes {
    constructor() {
        this.router = new Router();
        this.controller = new CallProcessingController();
        this.router.post('/call', this.processCallHandler.bind(this));    
    }

    async processCallHandler(req, res, next) {
        await this.controller.determineCallStatus(req.body)
            .then((response) => res.send(response))
            .catch((e) => next(e));
    }
}

module.exports = {
    url: '/api',
    router: new CallRoutes().router
}