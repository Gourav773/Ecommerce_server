const express = require('express');
const router = express.Router();

const { customerAuth } = require('../../middleware/customerAuth');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../../Controller/customer/cart');

router.get('/api/customer/cart', customerAuth, getCart);
router.post('/api/customer/cart', customerAuth, addToCart);
router.put('/api/customer/cart/:pid', customerAuth, updateCartItem);
router.delete('/api/customer/cart/:pid', customerAuth, removeCartItem);
router.delete('/api/customer/cart', customerAuth, clearCart);

module.exports = { customerCartRoutes: router };
