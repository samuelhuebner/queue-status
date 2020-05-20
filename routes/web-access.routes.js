const { Router } = require('express');


class WebAccessRoutes {
    constructor() {
        this.router = new Router();
        
        this.router.get('/', this.getStatusPage.bind(this));
    }

    getStatusPage(req, res, next) {
        res.render('index');
    }
}

module.exports = {
    url: '/',
    router: new WebAccessRoutes().router
}