const { Router } = require('express');

const { CallProcessingController } = require('../controller');



class CallRoutes {
    constructor() {
        this.router = new Router();
        this.controller = new CallProcessingController();
        this.router.post('/', this.processCallHandler.bind(this));    
    }

    processCallHandler(req, res, next) {
        this.controller.determineCallStatus(req.body)
            .then((response) => res.send(response))
            .catch((e) => next(e));
    }
}