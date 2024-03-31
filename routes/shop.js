const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {
    res.send('<body><h2> Hello from Express!!! </h2></body>');
});

module.exports = router;
