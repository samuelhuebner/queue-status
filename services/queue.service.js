const event = require('./event.service');

class QueueService {
    /**
     * Creates a new QueueService object
     * @param {number} queueId
     */
    constructor(queueId) {
        this.queuedCalls = {};
        this.queueId = queueId;
    }

    get length() {
        return Object.keys(this.queuedCalls).length;
    }

    /**
     * Adds a new call to the queue
     * @param {*} callId
     */
    addNewCall(callId) {
        // eslint-disable-next-line no-console
        console.warn(`Queue ${this.queueId}: new call in queue - callId: ${callId}`);
        this.queuedCalls[callId] = true;
    }

    /**
     * Removes a call from the queued-calls object
     * @param {number} callId
     * @returns
     */
    removeCall(callId) {
        const isAvailable = this.queuedCalls[callId];

        if (isAvailable) {
            delete this.queuedCalls[callId];
            // eslint-disable-next-line no-console
            console.warn(`Queue ${this.queueId}: deleting call - callId: ${callId}`);
            return { callId };
        }

        return {};
    }

    /**
     * Resets the hotline
     */
    resetHotline() {
        this.queuedCalls = {};

        const s = `updatehotline${this.queueId}`;
        console.log(s);
        event.emit(s);
    }
}

module.exports = {
    mainQueue: new QueueService(1),
    hailQueue: new QueueService(2)
};