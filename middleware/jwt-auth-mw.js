const expressJwt = require('express-jwt');

module.exports = expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] })
    .unless({
        path: ['/auth/signup', '/auth/login', '/api/call', '/verify/user']
    });