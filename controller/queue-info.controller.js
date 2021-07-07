const { hailQueue, mainQueue } = require('../services/queue.service');

class QueueInfoController {
    getHotlineOneQueueStatus() {
        return mainQueue.length;
    }

    getHotlineTwoQueueStatus() {
        return hailQueue.length;
    }

    /**
     * Resets the hotline counter to 0
     * @param {number} hotlineId
     */
    resetHotline(hotlineId) {
        switch (hotlineId) {
            case 1:
                mainQueue.resetHotline();
                break;
            case 2:
                hailQueue.resetHotline();
                break;
            default:
                break;
        }
    }
}

module.exports = QueueInfoController;