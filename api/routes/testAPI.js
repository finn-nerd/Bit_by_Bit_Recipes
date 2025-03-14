// imports express and creates a router
var express = require('express');
var router = express.Router();

// PostgreSQL database connection
const {Client} = require('pg')
const client = new Client({
    user: "postgres",
    password: "newpassword",
    host: "localhost",
    database: "users",
})

connect();
async function connect() {
    try {
        await client.connect()
        console.log("Connected to the database.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

// when a GET request is made to '/', the server will respond with the message
router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

// exports router for other files to use
module.exports = router;