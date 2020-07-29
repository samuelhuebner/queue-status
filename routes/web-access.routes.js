const { Router } = require('express');
const { QueueInfoController } = require('../controller');

class WebAccessRoutes {
    constructor() {
        this.router = new Router();

        this.controller = new QueueInfoController();
        
        this.router.get('/queue-status', this.getStatus.bind(this));
        this.router.get('/queue-status/event-stream', this.getEventStream.bind(this));
    }

    getStatus(req, res, next) {
        const status = this.controller.getQueueStatus()
        res.set('Access-Control-Allow-Origin', '*') // TODO: allow only frontend url 
        res.status(200).send({ callsWaiting: status });
    }

    getEventStream(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*') // TODO: allow only frontend url 
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');

        this.getStatus(req, res, next);
    }
        
}

module.exports = {
    url: '/api',
    router: new WebAccessRoutes().router
}