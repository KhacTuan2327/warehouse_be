const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.get('/warehouses', warehouseController.getAllWarehouses);
router.post('/warehouses', warehouseController.createWarehouse);
router.put('/warehouses/:warehouse_id', warehouseController.updateWarehouse);
router.delete('/warehouses/:warehouse_id', warehouseController.deleteWarehouse);

module.exports = router;
