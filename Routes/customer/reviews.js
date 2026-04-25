const express = require('express');
const router = express.Router();

const { customerAuth } = require('../../middleware/customerAuth');
const { addReview } = require('../../Controller/customer/reviews');

router.post('/api/customer/reviews', customerAuth, addReview);

module.exports = { customerReviewRoutes: router };
