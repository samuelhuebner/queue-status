const { BadRequestError } = require('../errors');

module.exports = {
    parseNumber: (number, variableName, doThrow = true) => {
        const parsed = Number.parseInt(number);

        if (Number.isNaN(parsed)) {
            if (doThrow) {
                const msg = variableName ? `${variableName} is not a number.` : undefined;
                throw new BadRequestError(msg);
            } else {
                return null;
            }
        }
        return parsed;
    }
};