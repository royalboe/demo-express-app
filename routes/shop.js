const express = require('express');
const path = require('path');

const adminData = require('./admin');

const router = express.Router();
const rootDir = require('../util/path');


router.get('/', (req, res, next) => {
    // console.log('shop.js', adminData.products);
    const products = adminData.products;
    res.render('shop', {prods: products, docTitle: 'Shop'});
});

module.exports = router;
