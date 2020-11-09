/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const _ = require('lodash');
const { Router } = require('express');
const { QueueInfoController, CallInformationController, CallProcessingController } = require('../controller');

const ongoingCallService = require('../services/ongoing-call.service');

class WebAccessRoutes {
    constructor() {
        this.router = new Router();

        this.queueInfoController = new QueueInfoController();
        this.callInfoController = new CallInformationController();
        this.callProcessingController = new CallProcessingController();

        this.router.get('/queue-status/hotline1', this.getHotlineOneStatus.bind(this));
        this.router.get('/queue-status/hotline2', this.getHotlineTwoStatus.bind(this));

        this.router.get('/call-stats/current', this.getCurrentCalls.bind(this));
        this.router.get('/call-stats/current/:id', this.getCall.bind(this));
        this.router.post('/call-stats/current/', this.removeStuckCall.bind(this));

        this.router.get('/call-stats/monthly-inbound', this.getMonthlyInboundCallCount.bind(this));
        this.router.get('/call-stats/daily-reachability', this.getDailyInboundReachability.bind(this));

        this.router.get('/call-stats/calls', this.getAllCalls.bind(this));
        this.router.get('/call-stats/destinations', this.getDestinationsHandler.bind(this));
        this.router.get('/call-stats/destinations/:id', this.getDestinationsHandler.bind(this));
    }

    getHotlineOneStatus(req, res, next) {
        try {
            const status = this.queueInfoController.getHotlineOneQueueStatus();
            res.send({ callsWaiting: status });
        } catch (error) {
            next(error);
        }
    }

    getHotlineTwoStatus(req, res, next) {
        try {
            const status = this.queueInfoController.getHotlineTwoQueueStatus();
            res.send({ callsWaiting: status });
        } catch (error) {
            next(error);
        }
    }

    async getMonthlyInboundCallCount(req, res, next) {
        const count = await this.callInfoController.getInboundCallNumber();
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

    async getAllCalls(req, res, next) {
        this.callInfoController.getCalls()
            .then((result) => res.send(result))
            .catch((e) => next(e));
    }

    getCurrentCalls(req, res, next) {
        try {
            res.send(ongoingCallService.getOngoingCallsList());
        } catch (error) {
            next(error);
        }
    }

    getCall(req, res, next) {
        try {
            res.send(ongoingCallService.getCall(req.params.id));
        } catch (error) {
            next(error);
        }
    }

    getDestinationsHandler(req, res, next) {
        this.callInfoController.getCallDestinations(req.params.id)
            .then((result) => res.send(result))
            .catch((error) => next(error));
    }

    async removeStuckCall(req, res, next) {
        try {
            const call = ongoingCallService.getCall(req.body.callId);
            ongoingCallService.removeOngoingCall(_.get(call, 'callId'));

            await this
                .callProcessingController
                .endCall({ call_id: _.get(call, 'callId'), reason: 'manual-completion' }, _.get(call, 'direction'));
            res.send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    url: '/api',
    router: new WebAccessRoutes().router
};