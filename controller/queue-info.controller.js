const { hailQueue, mainQueue } = require('../services/queue.service');

class QueueInfoController {
    getHotlineOneQueueStatus() {
        return mainQueue.length;
    }

    getHotlineTwoQueueStatus() {
        return hailQueue.length;
    }
    }
}

module.exports = QueueInfoController;