var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var mongo = require('mongodb');
var config = require('./config.js');
var db = require('monk')('mongodb://Recipify:MSIN636!@ds229474.mlab.com:29474/recipify');

var multer=require('multer');
var upload = multer({ dest: 'public/images/uploads/' });
var flash=require('connect-flash');
var logger = require('morgan');
var expressValidator=require('express-validator');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');

var app = express();
app.locals.moment = require('moment');


app.locals.truncateText = function(text, length){
 var truncatedText = text.substring(0,length);
 return truncatedText;
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'secret',
    saveUninitialized:true,
    resave: true
  }));
  app.use(expressValidator());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', indexRouter);
console.log('yes');
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
