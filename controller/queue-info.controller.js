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
                console.log(hotlineId);
                mainQueue.resetHotline();
                break;
            case 2:
                console.log(hotlineId);
                hailQueue.resetHotline();
                break;
            default:
                console.log('break');
                break;
        }
    }
}

module.exports = QueueInfoController;