var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var pengajuan = require('./routes/pengajuan');
var pengembalian = require('./routes/pengembalian');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var connection = require('express-myconnection');
var mysql = require('mysql');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"telkom"}));
app.use(flash());
app.use(expressValidator());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body)
        {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*------------------------------------------
connection peer, register as middleware
type koneksi : single,pool and request
-------------------------------------------*/
app.use(
    connection(mysql,{
        host: 'bbmflnvu8ehplvvozq5e-mysql.services.clever-cloud.com',
        user: 'urbynbdahg2kjuj4', // your mysql user
        password : '0HCWeddTvJFv1HzqvGJ8', // your mysql password
        port : 3306, //port mysql
        database:'bbmflnvu8ehplvvozq5e' // your database name
    },'pool') //or single
);
app.use('/', index);
app.use('/pengajuan', pengajuan);
app.use('/pengembalian', pengembalian);
app.use('/users', users);
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
module.exports = app;
const APP_PORT = process.env.PORT || '9999';
app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}...`);
  });