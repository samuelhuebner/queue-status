module.exports = class UnauthorizedError extends Error {
    constructor(message) {
        super('Unauthorized error');
        this.status = 401;
        this.internalMsg = message;
    }
};