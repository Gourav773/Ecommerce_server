const express = require('express');
const router = express.Router();

const { customerAuth } = require('../../middleware/customerAuth');
const { getWishlist, addWishlist, removeWishlist } = require('../../Controller/customer/wishlist');

router.get('/api/customer/wishlist', customerAuth, getWishlist);
router.post('/api/customer/wishlist', customerAuth, addWishlist);
router.delete('/api/customer/wishlist/:pid', customerAuth, removeWishlist);

module.exports = { customerWishlistRoutes: router };
