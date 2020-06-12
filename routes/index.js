const { Router } = require('express');

const router = new Router();

const webAccessRoutes = require('./web-access.routes');
const callRoutes = require('./call.routes');

router.use(webAccessRoutes.url, webAccessRoutes.router);
router.use(callRoutes.url, callRoutes.router);

module.exports = router;