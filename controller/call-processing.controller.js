const _ = require('lodash');

const { NotFoundError, BadRequestError, FailedTransactionError } = require('../errors');

class CallProcessingController {

    async determineCallStatus(data) {
        const callStatus = _.get(data, 'status');
        if (callStatus) {
            if (callStatus === 'inbound') {
                this.registerNewCall(data)
                    .then((res) => {
                        return res;
                    });
            }
        } else {
            throw new BadRequestError('invalid request');
        }
    }


    async registerNewCall(data) {
        
    }
}

module.exports = CallProcessingController;