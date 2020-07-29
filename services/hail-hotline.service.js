const _ = require('lodash');

class HailHotline {
    constructor() {
        this.queue = [];
    }

    get length() {
        return this.queue.length;
    }

    addNewCall(callId) {
        console.warn('new call in queue');
        this.queue.push({ callId });
    }

    removeCall(callId) {
        if (this.queue.length === 0) {
            return {};
        }

        if (this.queue.length === 1 && _.get('this.queue[0].callId') === callId) {
            const last = this.queue.pop();
            this.queue = [];
            return last;
        }

        for (let i = 0; i < this.queue.length; i += 1) {
            const item = this.queue[i];

            if (!item) {
                continue;
            }

            if (i === this.queue.length-1 && item.callId === callId) {
                return this.queue.pop();
            }

            if (item.callId === callId) {
                const last = this.queue[this.queue.length-1];

                this.queue[this.queue.length-1] = item;
                this.queue[i] = last;
                return this.queue.pop();
            }
        }
    }

}

module.exports = new HailHotline();