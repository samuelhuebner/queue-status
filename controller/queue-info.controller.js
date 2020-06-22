const db = require('../models');
const hailHotlineService = require('../services/hail-hotline.service');

class QueueInfoController {
    getQueueStatus() {
        return hailHotlineService.length;
    }
}

module.exports = QueueInfoController;