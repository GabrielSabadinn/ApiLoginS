const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/l', authController.login);
router.post('/r', authController.resetPassword);

module.exports = router;