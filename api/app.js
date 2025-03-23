const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testAPIRouter = require('./routes/testAPI');

const app = express();

// start server (development only)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// service static files for frontend build
app.use(express.static(path.join(__dirname, '../client/build')));

// route handlers
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/testAPI', testAPIRouter);

// test client side
app.post('/api/client-side-test', (req, res) => {
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

// if deployed, wrap in serverless for Vercel
if (process.env.NODE_ENV === 'production') {
    const serverless = require('serverless-http');
    module.exports = serverless(app);
  } else {
    module.exports = app;
  }