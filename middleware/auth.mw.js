const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.method === 'POST' && _.get(req.query, 'fred') !== process.env.API_KEY  || !req.ip.includes(process.env.ALLOWED_POST_IP)) {
        res.status(403).send('you are not authorized to post to this url');
    } else {
        next();
    }
};