const { Router } = require('express');

const router = new Router();

const webAccessRoutes = require('./web-access.routes');
const callRoutes = require('./call.routes');
const authRoutes = require('./auth.routes');

router.use(webAccessRoutes.url, webAccessRoutes.router);
router.use(callRoutes.url, callRoutes.router);
router.use(authRoutes.url, authRoutes.router);

module.exports = router;