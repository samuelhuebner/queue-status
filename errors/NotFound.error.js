module.exports = class NotFoundError extends Error {
    constructor(msg) {
        super('Not found');
        this.status = 404;
        this.internalMsg = msg;
    }
};