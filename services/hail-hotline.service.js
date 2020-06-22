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

        if (this.queue.length === 1 && this.queue[0].callId === callId) {
            const last = this.queue.pop();
            this.queue = [];
        }

        for (let i = 0; i < this.queue.length; i += 1) {
            const item = this.queue[i];
            if (i === this.length-1 && item.callId === callId) {
                return this.queue.pop();
            }

            if (item.callId === callId) {
                const last = this.queue[this.length];

                this.queue[this.length] = item;
                this.queue[i] = last;
                return this.queue.pop();
            }
        }
    }

}

module.exports = new HailHotline();