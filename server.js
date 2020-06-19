require('dotenv').config();

const Express = require('express');
const { error, debug, auth } = require('./middleware');

const event = require('./services/event.service');

class Server {
    constructor(routes) {
        this.app = new Express();
        this.app.use(Express.json());
        this.app.use(auth);
        this.app.use(error);
        this.app.use(debug);
        this.app.use(routes);
        this.app.listen(process.env.SVC_PORT, () => console.log(`${process.env.SVC_NAME} listening to port ${process.env.SVC_PORT}`));

        this.http = require('http').Server(this.app);
        this.io = require('socket.io')(this.http);

        this.io.on('connection', socket => {
            console.log('client connected');
            socket.on('disconnect', () => {
                console.log('client disconnected');
            })
            socket.emit('update');
        });

        event.on('queueUpdate', () => {
            this.io.sockets.emit('update');
        });

        this.http.listen(process.env.WEBSOCKET_PORT);
    }
}

module.exports = new Server(require('./routes'));