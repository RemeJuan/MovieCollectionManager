var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var mongoose = require('mongoose');

var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');
var canAccess = require('./auth/restrict');

var index = require('./routes/index');
var collection = require('./routes/collection');
var search = require('./routes/search-results');
var wanted = require('./routes/wanted');
var details = require('./routes/movie-details');
var login = require('./routes/login');
var admin = require('./routes/admin');
// var users = require('./routes/users');

mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/movies-collection'

mongoose.connect(mongoUri);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.swig);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var MongoStore = connectMongo(expressSession);

app.use(expressSession(
  {
    secret: 'getting hungry',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
  }
));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/collection', collection);
app.use('/search-results', search);
app.use('/wanted', wanted);
app.use('/movie-details', details);
app.use('/login', login);
app.use('/admin', canAccess.isLoggedIn, admin);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
