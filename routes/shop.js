const express = require('express');

const shopController = require("../controllers/shop");

const router = express.Router();

// Router for the home path
// / => GET Method
router.get('/', shopController.getIndex);

// Router for the products path
// /products => GET Method
router.get('/products', shopController.getProducts);

// Router for the product path
// /products/:productId => GET Method
router.get('/product/:productId', shopController.getProductDetails);

// Router for the orders path
// /orders => GET Method
router.get('/orders', shopController.getOrders);

// Router for the checkout path
// /checkout => GET Method
router.get('/checkout', shopController.getCheckout);

// Router for the cart path
// /cart => GET Method
router.get('/cart', shopController.getCart);


// Router for the add-to-cart path
// /cart => POST Method
router.post('/cart', shopController.postCart);

// // Router for the orders path
// // /orders => GET Method
// router.get('/orders', shopController.getOrders);


// // Router for the add-to-cart path
// // /add-to-cart => POST Method
// router.post('/add-to-cart', shopController.postCart);

// // Router for the delete-from-cart path
// // /delete-from-cart => POST Method

// // Router for the cart path
// // /cart => GET Method
// router.get('/cart', shopController.getCart);


// // Router for the product path
// // /product/:productId => GET Method
// // router.get('/product/:productId', shopController.getProduct);

// // Router for the add-to-cart path
// // /add-to-cart => POST Method
// // router.post('/add-to-cart', shopController.postCart);

// // Router for the delete-from-cart path
// // /delete-from-cart => POST Method
// router.post('/delete-from-cart', shopController.postDeleteCart);

// // Router for the create-order path
// // /create-order => POST Method
// router.post('/create-order', shopController.postOrder);

// // Router for the reset-cart path
// // /reset-cart => POST Method
// router.post('/reset-cart', shopController.postResetCart);

module.exports = router;
