/* eslint-disable no-undef */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogpostsRouter = require('./routes/blogposts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for all routes

mongoose.connect('mongodb+srv://omkarbadve10:cSZwQ7eurGiSRVGd@cluster0.nnxvc7w.mongodb.net/blogger?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to db'))
  .catch((err) => console.error(err));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blogposts', blogpostsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  res.render('error', {title: 'Blogger Backend'});
});

module.exports = app;
