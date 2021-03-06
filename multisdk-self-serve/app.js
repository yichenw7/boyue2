var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var config=require("./config");
var app = express();
app.use(session({
	secret: 'secret',
	cookie:{
	   maxAge: 1000*60*60*24 //毫秒
	},
	resave: true, saveUninitialized: true
}));
app.use(cookieParser());

//防止崩溃
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//用html作为模板
app.engine("html",require("ejs").__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*',function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	res.header("X-Powered-By",' 3.2.1')
	res.header('Access-Control-Allow-Credentials', true);//告诉客户端可以在HTTP请求中带上Cookie
  next()
});

app.use('/', index);
app.use('/main', index);
app.use('/getgame', index);
app.use('/getpaycallback', index);
app.use('/getpaycallbacklist', index);
app.use('/getpackagelist', index);
app.use('/addpaycallback', index);
app.use('/getpaycallbackbyid', index);
app.use('/editpaycallback', index);
app.use('/addgame', index);
app.use('/token', index);
app.use('/registerapi', index);
app.use('/login', index);
app.use('/disablepaycallback', index);
app.use('/setadamin', index);
app.use('/getadminlist', index);
app.use('/canceladmin', index);
app.use('/loginapi', index);
app.use('/ordermgt', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(config.port, function () {
    console.log('app listening on port', "3000");

    console.log('');
});


module.exports = app;
