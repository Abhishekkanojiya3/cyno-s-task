const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/generate-otp', authController.generateOTP);

router.post('/verify-otp', authController.verifyOTP);

module.exports = router;