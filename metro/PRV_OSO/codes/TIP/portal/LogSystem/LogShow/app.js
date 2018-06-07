const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.urlencoded({ extended: false })); //���� application/x-www-form-urlencoded����
app.use(bodyParser.json());

const engine = require('ejs-mate');
///======= view engine setup  ģ�� ��ʼ===========//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
///======= view engine setup  ģ�� ����===========//

//·������
const index = require('./routes/index');
const users = require('./routes/users');
const search = require('./routes/search');
const errorlog = require('./routes/errorlog');
const warninglog = require('./routes/warninglog');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//�����ļ�Ŀ¼����
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//·������
app.use('/index', index);
app.use('/users', users);
app.use('/search', search);
app.use('/errorlog', errorlog);
app.use('/warninglog', warninglog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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


