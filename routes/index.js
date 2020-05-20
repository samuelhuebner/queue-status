const { Router } = require('express');

const router = new Router();

const webAccessRoutes = require('./web-access.routes');

router.use(webAccessRoutes.url, webAccessRoutes.router);

module.exports = router;