module.exports = class AuthenticationError extends Error {
    constructor(message) {
        super('Authentication Error');
        this.status = 401;
        this.internalMsg = message;
    }
};