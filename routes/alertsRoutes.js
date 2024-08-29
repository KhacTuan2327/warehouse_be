const express = require('express');
const router = express.Router();
const { getAlerts } = require('../controllers/alertsController'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const { addAlert } = require('../controllers/alertsController');
const { updateAlertResolved } = require('../controllers/alertsController');

// Route để lấy danh sách cảnh báo
router.get('/alerts', getAlerts);
router.post('/alerts', addAlert);
router.put('/alerts/:alert_id', updateAlertResolved);

module.exports = router;
