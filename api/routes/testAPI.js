// imports express and creates a router
var express = require('express');
var router = express.Router();

// when a GET request is made to '/', the server will respond with the message
router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

// exports router for other files to use
module.exports = router;