// routes/sensorRoutes.js

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Định nghĩa route để lấy danh sách cảm biến
router.get('/sensors', sensorController.getSensors);
router.put('/sensors/:sensor_id', sensorController.updateSensor);
router.delete('/sensors/:sensor_id', sensorController.deleteSensor);
router.post('/sensors', sensorController.addSensor);

module.exports = router;
