const db = require('../models');

class QueueInfoController {
    async getQueueStatus() {
        const queue = await db.queue.findOne({ where: { queueName: process.env.HOTLINE_NAME } });
        if (!queue) {
            return 0;
        }

        return queue.callsWaiting;
    }
}

module.exports = QueueInfoController;