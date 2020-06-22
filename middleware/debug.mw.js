// enables debugging logs if flag is set
module.exports = (req, res, next) => {
    if (process.env.DEBUG) {
        console.log(`${req.method}: ${req.originalUrl}`);
        console.log(`call-id: ${req.get('call_id')}`);
        console.log(`status: ${req.get('status')}`);
    }
    next();
};