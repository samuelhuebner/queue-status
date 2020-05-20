'use strict';

const Express = require('express');
const { error, debug } = require('./middleware');

class Server {
    constructor(routes) {
        this.app = new Express();
        this.app.use(error);
        this.app.use(debug);
        this.app.use(routes);
        this.app.use(Express.static('public'));
        this.app.set('view engine', 'ejs');
        this.app.listen(process.env.SVC_PORT, () => console.log(`${process.env.SVC_NAME} listening to port ${process.env.SVC_PORT}`));
    }
}

module.exports = new Server(require('./routes'));