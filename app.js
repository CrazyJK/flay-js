import express, { json, urlencoded } from 'express';
import { createServer } from 'http';
import favicon from 'serve-favicon';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { join, resolve } from 'path';
import logger from 'morgan';

import indexRouter from './routes/indexRouter.js';
import flayViewRouter from './routes/flayViewRouter.js';
import flayApiRouter from './routes/flayApiRouter.js';

const __dirname = resolve();
const port = process.env.PORT || 4000;
const app = express();

// app.locals.pretty = true;

// view engine setup
// ### ejs & layouts
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.use(expressLayouts);
// ### jade
// app.set('views', join(__dirname, 'views_jade'));
// app.set('view engine', 'jade');
// ### pug
// app.set('views', join(__dirname, 'views_pug'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
app.use(favicon(join(__dirname, 'public', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/flay', flayViewRouter);
app.use('/api', flayApiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (err.status !== 404) console.log('error', res.locals);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// app.set('port', port);

const server = createServer(app);
server
	.listen(port)
	.on('error', (error) => {
		if (error.syscall !== 'listen') {
			throw error;
		}
		const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	})
	.on('listening', () => {
		const addr = server.address();
		const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
		console.log(`
    ############################################
        Flay JS Start. Listening on ${bind}
    ############################################
		env ${app.get('env')}
		`);
	});
