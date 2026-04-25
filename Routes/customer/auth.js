const express = require('express');
const router = express.Router();

const { register, login, me, otpRequest, otpVerify } = require('../../Controller/customer/auth');
const { customerAuth } = require('../../middleware/customerAuth');

router.post('/api/customer/auth/register', register);
router.post('/api/customer/auth/login', login);
router.get('/api/customer/auth/me', customerAuth, me);

// OTP
router.post('/api/customer/auth/otp/request', otpRequest); // body: { mobile, purpose: login|reset }
router.post('/api/customer/auth/otp/verify', otpVerify);   // body: { mobile, otp, purpose, newPassword? }

module.exports = { customerAuthRoutes: router };
