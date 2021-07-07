const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.originalUrl === '/auth/signup'
        || req.originalUrl === '/auth/login'
        || _.includes(req.originalUrl, '/verify/user')
        || _.includes(req.originalUrl, '/api/call-stats/current')
        || _.includes(req.originalUrl, '/api/queue-status/hotline/reset')) {
        next();
        return;
    }

    if (req.method === 'POST' && _.get(req.query, 'fred') !== process.env.API_KEY) {
        res.status(403).send('you are not authorized to post to this url');
        if (process.env.DEBUG) {
            // eslint-disable-next-line no-console
            console.log(`Denied Request from ${req.ip}`);
        }
    } else {
        next();
    }
};