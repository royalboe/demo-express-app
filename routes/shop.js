const express = require('express');
const isAuth = require("../middleware/is-auth");

const shopController = require("../controllers/shop-main");

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

// Router for the cart path
// /cart => GET Method
router.get('/cart', isAuth, shopController.getCart);

// Router for the add-to-cart path
// /cart => POST Method
router.post('/cart', isAuth, shopController.postCart);

// Router for the delete-from-cart path
// /delete-from-cart => POST Method
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// Router for the orders path
// /orders => GET Method
router.get('/orders', isAuth, shopController.getOrders);


// Router for the create-order path
// /create-order => POST Method
router.post("/create-order", isAuth, shopController.postOrder);

// Router for order invoice
// /get-invoice => GET method
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

// Router for the reset-cart path
// /reset-cart => POST Method
router.post("/reset-cart", isAuth, shopController.postResetCart);

module.exports = router;
