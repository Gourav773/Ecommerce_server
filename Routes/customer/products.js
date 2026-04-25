const express = require('express');
const router = express.Router();

const { listProducts, getProduct, listCategories, listSubcategories } = require('../../Controller/customer/products');

router.get('/api/customer/categories', listCategories);
router.get('/api/customer/subcategories', listSubcategories);

router.get('/api/customer/products', listProducts);
router.get('/api/customer/products/:pid', getProduct);

module.exports = { customerProductRoutes: router };
