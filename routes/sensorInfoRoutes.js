const express = require('express');
const router = express.Router();
const sensorInfoController = require('../controllers/sensorInfoController');

// Định nghĩa route để lấy danh sách sensor_info
router.get('/sensor-info', sensorInfoController.getSensorInfoList);
router.post('/sensor-info', sensorInfoController.addSensorInfo);
router.put('/sensor-info/:info_id', sensorInfoController.updateSensorInfo);
router.delete('/sensor-info/:info_id', sensorInfoController.updateSensorInfo);

module.exports = router;
