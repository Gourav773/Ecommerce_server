const express = require('express');
const router = express.Router();

const { customerAuth } = require('../../middleware/customerAuth');
const { getMyOrders, placeOrder } = require('../../Controller/customer/orders');

router.get('/api/customer/orders', customerAuth, getMyOrders);
router.post('/api/customer/orders/place', customerAuth, placeOrder);

module.exports = { customerOrderRoutes: router };
