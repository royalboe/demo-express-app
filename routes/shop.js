const express = require('express');
const path = require('path');

const adminData = require('./admin');

const router = express.Router();
const rootDir = require('../util/path');


router.get('/', (req, res, next) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
