// maps middleware files to variables
module.exports = {
    debug: require('./debug.mw'),
    error: require('./error.mw'),
    auth: require('./auth.mw'),
    cors: require('./cors.mw'),
    jwtAuth: require('./jwt-auth-mw')
};