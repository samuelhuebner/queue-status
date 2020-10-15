/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-console */
require('dotenv').config();

const Express = require('express');
const bodyParser = require('body-parser');
const { error, debug, auth, jwtAuth, cors } = require('./middleware');

const event = require('./services/event.service');

class Server {
    constructor(routes) {
        this.app = new Express();
        this.app.use(cors);
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(debug);
        this.app.use(jwtAuth);
        this.app.use(auth);
        this.app.use(routes);
        this.app.use(error);
        this.app.listen(process.env.SVC_PORT, () => console.log(`${process.env.SVC_NAME} listening to port ${process.env.SVC_PORT}`));

        this.http = require('http').Server(this.app);

        const allowedOrigins = `https://${process.env.FRONTEND_URL}:*`;

        this.io = require('socket.io')(this.http, { path: '/websocket/socket.io', transport: ['websocket'], origins: allowedOrigins });

        this.io.on('connection', (socket) => {
            console.log('client connected');
            socket.on('disconnect', () => {
                console.log('client disconnected');
            });
            socket.emit('update');
        });

        // events
        event.on('hailQueueUpdate', () => {
            this.io.sockets.emit('updatehotline2');
        });

        event.on('mainQueueUpdate', () => {
            this.io.sockets.emit('updatehotline1');
        });

        event.on('callInserted', (callId) => {
            this.io.sockets.emit('callInserted', callId);
            console.log('callInserted');
        });

        this.http.listen(process.env.WEBSOCKET_PORT);
    }
}

module.exports = new Server(require('./routes'));