const express = require('express');

const Route = express.Route();


Route.use('/', (req, res, next) => {
    res.send('<body><h2> Hello from Express!!! </h2></body>');
});

module.exports = Route;
