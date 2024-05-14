const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// // /admin/add-product => GET Method
router.get('/add-product', adminController.addProducts);

// // /admin/products => GET Method
// router.get('/products', adminController.getProducts);

// // /admin/add-product => POST Method
router.post('/add-product', adminController.postProducts);

// // // /admin/edit-product/:productId => GET Method
// router.get('/edit-product/:productId', adminController.editProduct);

// // // /admin/edit-product => POST Method
// router.post('/edit-product', adminController.postEditProduct);

// // /admin/delete-product => POST Method
// router.post('/delete-product', adminController.deleteProduct);

// router.post('/add-user', adminController.addUser);

module.exports = router;
