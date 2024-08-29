const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Route để lấy danh sách thiết bị
router.get('/devices', deviceController.getDevices);
router.put('/devices/:device_id', deviceController.updateDevice);
router.post('/devices', deviceController.addDevice);
router.delete('/devices', deviceController.deleteDevice);

module.exports = router;
