var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// test the API
var testAPIRouter = require('./routes/testAPI');

var app = express();

// ensure backend is running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// service frontend build
app.use(express.static(path.join(__dirname, '../client/build')));

// route handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// test the API
app.use('/testAPI', testAPIRouter);

// test client side
app.post('/client-side-test', (req, res) => {
    const data = req.body.input;
    console.log('Received:', data);
    res.json({ message: "SERVER RECEIVED: " + data});
});

// catch-all route to handle all missed frontend requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

module.exports = app;
