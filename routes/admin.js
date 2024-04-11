const express = require('express');

const adminController = require('../controllers/products');

const router = express.Router();

// /admin/add-product => GET Method
router.get('/add-product', adminController.addProducts);

// /admin/products => GET Method
router.get('/products', adminController.getProducts);

// /admin/add-product => POST Method
router.post('/add-product', adminController.postProducts);

module.exports = router;
