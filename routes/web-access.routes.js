const { Router } = require('express');
const { QueueInfoController } = require('../controller');

class WebAccessRoutes {
    constructor() {
        this.router = new Router();

        this.controller = new QueueInfoController();
        
        this.router.get('/', this.getStatusPage.bind(this));
    }

    getStatusPage(req, res, next) {

        this.controller.getQueueStatus()
            .then((result) => {
                res.render('index', { callsWaiting: result });
            });
    }
}

module.exports = {
    url: '/',
    router: new WebAccessRoutes().router
}