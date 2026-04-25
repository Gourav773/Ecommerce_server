const express = require('express');
const router = express.Router();

const { customerAuth } = require('../../middleware/customerAuth');
const { createOrder, verifyOrder } = require('../../Controller/customer/payments');

router.post('/api/customer/payments/create-order', customerAuth, createOrder);
router.post('/api/customer/payments/verify', customerAuth, verifyOrder);

module.exports = { customerPaymentRoutes: router };
