const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định nghĩa route cho việc thêm tài khoản
router.post('/users', userController.addUser);
router.post('/login', userController.login);

module.exports = router;
