const _ = require('lodash');
// enables debugging logs if flag is set
module.exports = (req, res, next) => {
    if (process.env.DEBUG) {
        console.log(`${req.method}: ${req.originalUrl}`);
        console.log(`call-id: ${_.get(req.body, 'call_id')}`);
        console.log(`status: ${_.get(req.body, 'status')}`);
    }
    next();
};