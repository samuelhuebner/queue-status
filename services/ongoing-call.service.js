const event = require('./event.service');

class OngoingCallService {
    constructor() {
        this.ongoingCalls = [];
    }

    getOngoingCallsList() {
        return this.ongoingCalls;
    }

    addNewCall(call) {
        this.ongoingCalls.unshift(call);
        event.emit('callInserted', call.callId);

        console.log('callInserted event emitted: ' + call.callId);
    }

    updateExistingCall(call) {
        this.ongoingCalls.forEach((item, index) => {
            if (item.callId !== call.callId) {
                return;
            }

            this.ongoingCalls[index] = { ...item, call };

            event.emit('callUpdated', call.callId);
        });
    }

    removeOngoingCall(call) {
        this.ongoingCalls.forEach((item, index) => {
            if (item.callId !== call.callId) {
                return;
            }

            const [deleted] = this.ongoingCalls.splice(index, 1);
            if (deleted) {
                event.emit('callFinished', deleted.callId);
            }
        });
    }

    getCall(callId) {
        let returnValue = {};
        this.ongoingCalls.forEach((item) => {
            if (item.callId !== callId) {
                return;
            }

            returnValue = item;
        });

        return returnValue;
    }
}

module.exports = new OngoingCallService();