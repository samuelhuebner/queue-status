module.exports = class BadRequestError extends Error {
    constructor(message) {
        super('Bad Request');
        this.status = 400;
        this.internalMsg = message;
    }
};