const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const router = express.Router();

// To store data
const products = [];

// /admin/add-product => GET Method
router.get('/add-product', (req, res, next) => {
    res.render('add-product');
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) =>
{
    products.push({'title': req.body.title});
    res.redirect('/');
});

exports.router = router;
exports.products = products;
