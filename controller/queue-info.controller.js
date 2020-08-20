const db = require('../models');
const hailHotlineService = require('../services/hail-hotline.service');
const mainHotlineService = require('../services/main-hotline.service');

class QueueInfoController {
    getHotlineOneQueueStatus() {
        return mainHotlineService.length;
    }
    getHotlineTwoQueueStatus() {
        return hailHotlineService.length;
    }
}

module.exports = QueueInfoController;