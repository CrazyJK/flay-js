const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');

const indexRouter = require('./routes/index');
const flayRouter = require('./routes/flay');

const myLogger = function (req, res, next) {
	console.log('myLogger', 'LOGGED');
	next();
};
const requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	console.log('requestTime', req.requestTime);
	next();
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(myLogger);
app.use(requestTime);

app.use('/', indexRouter);
app.use('/flay', flayRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	console.log('wrong url', req.url);
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

/*
app.get('/middleware', function (req, res) {
	var responseText = 'Hello World!';
	responseText += 'Requested at: ' + req.requestTime + '';
	res.send(responseText);
});

// add my controller
app.get('/new-entry', function (req, res) {
	res.render('new-entry');
});

app.post('/new-entry', function (req, res) {
	if (!req.body.title || !req.body.body) {
		res.status(400).send('Entries must have a title and a body.');
		return;
	}
	entries.push({
		title: req.body.title,
		body: req.body.body,
		published: new Date(),
	});
	res.redirect('/');
});

// path variables
app.get('/topic/:id/:mode', function (req, res) {
	// 라우터 경로의 변경 /:id/:mode 를 통해 path 방식 url 값을 가져올 수 있다.
	var topic = ['javascript is...', 'nodejs is...', 'express is...'];
	var li = `
		<li><a href="/topic/0">js</a></li>
		<li><a href="/topic/1">nodejs</a></li>
		<li><a href="/topic/2">express</a></li>
		`;
	res.send(li + '<br>' + topic[req.params.id] + req.params.mode);
	//path 방식을 사용하는 url의 경우 params를 통해서 값을 가져올 수 있음
});

// query
app.get('/topic', function (req, res) {
	var topic = ['javascript is...', 'nodejs is...', 'express is...'];
	var li = `
	<li><a href="/topic?id=0">js</a></li>
	<li><a href="/topic?id=1">nodejs</a></li>
	<li><a href="/topic?id=2">express</a></li>
	`;
	// 선택한 링크에 따라서 다른 정보를 출력하는 동적인 애플리케이션의 기본골격
	res.send(li + '<br>' + topic[req.query.id]);
});
*/
