const _ = require('lodash');
const { Router } = require('express');
const { QueueInfoController, CallInformationController } = require('../controller');

class WebAccessRoutes {
    constructor() {
        this.router = new Router();

        this.queueInfoController = new QueueInfoController();
        this.callInfoController = new CallInformationController();
        
        this.router.get('/queue-status', this.getStatus.bind(this));
        this.router.get('/queue-status/event-stream', this.getEventStream.bind(this));
        this.router.get('/call-stats/monthly-inbound', this.getMonthlyInboundCallCount.bind(this));
        this.router.get('/call-stats/daily-reachability', this.getDailyInboundReachability.bind(this));
    }

    getStatus(req, res, next) {
        const status = this.queueInfoController.getQueueStatus()
        res.set('Access-Control-Allow-Origin', '*') // TODO: allow only frontend url 
        res.status(200).send({ callsWaiting: status });
    }

    async getMonthlyInboundCallCount(req, res, next) {
        const count = await this.callInfoController.getInboundCallNumber();
        res.set('Access-Control-Allow-Origin', '*') // TODO: allow only frontend url 
        res.status(200).send({ count });
    }

    async getDailyInboundReachability(req, res, next) {
        const day = _.get(req.query, 'day');

        let count;
        if (day) {
            count = await this.callInfoController.getReachability(new Date(day), new Date(day));
        } else {
            count = await this.callInfoController.getReachability();
        }
        res.status(200).send({ reachability: 100, numberOfCalls: count });
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