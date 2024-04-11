const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const productController = require('../controllers/products');
const router = express.Router();

// /admin/add-product => GET Method
router.get('/add-product', productController.addProducts);

// /admin/add-product => POST
router.post('/add-product', productController.postProducts);

module.exports = router;
