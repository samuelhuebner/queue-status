module.exports = class InternalServerError extends Error {
    constructor(message) {
        super('Internal server error');
        this.status = 500;
        this.internalMsg = message;
    }
};