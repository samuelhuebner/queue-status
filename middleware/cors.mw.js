module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, user-id');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE');
    next();
};