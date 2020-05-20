// enables debugging logs if flag is set
module.exports = (req, res, next) => {
    if (process.env.DEBUG) {
        console.log(`${req.method}: ${req.originalUrl}`);
        console.log(`user-id: ${req.get('user-id')}`);
    }
    next();
};