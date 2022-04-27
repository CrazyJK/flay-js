import express, { json, urlencoded } from 'express';
import { createServer } from 'https';
import { Server as SocketIoServer } from 'socket.io';
import favicon from 'serve-favicon';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { join, resolve } from 'path';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';

import indexRouter from './routes/indexRouter.js';
import flayViewRouter from './routes/flayViewRouter.js';
import flayApiRouter from './routes/flayApiRouter.js';

const __dirname = resolve();
const port = process.env.PORT || 443;
const app = express();

// view engine setup
// ### ejs & layouts
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.use(expressLayouts);

app.use(
	morgan('dev', {
		skip: (req, res) => res.statusCode < 400,
	}),
);
app.use(json());
app.use(cors());
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
	// console.log(req.headers);
	const resErr = {
		isXhr: req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept.indexOf('json') > -1,
		status: err.status || 500,
		message: err.message || 'unknown error',
		stack: err.stack,
	};

	if (req.app.get('env') !== 'development') {
		resErr.stack = null;
	}

	if (resErr.status !== 404) {
		console.log('error', resErr);
	}

	if (resErr.isXhr) {
		res.status(resErr.status).json(resErr);
	} else {
		// set locals, only providing error in development
		res.locals.message = resErr.message;
		res.locals.error = resErr;
		res.status(resErr.status).render('error');
	}
});

const serverOptions = {
	pfx: fs.readFileSync('certs/kamoru.jk.p12'),
	passphrase: '697489',
};

const httpsServer = createServer(serverOptions, app);
httpsServer
	.listen(port)
	.on('error', (error) => {
		console.error('server error', error);
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
		const addr = httpsServer.address();
		const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
		console.log(`
    ############################################
        Flay JS Start. Listening on ${bind}
    ############################################
		env ${app.get('env')}
		`);

		setInterval(() => {
			console.debug(`Server memory used ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
		}, 1000 * 10);
	});

const [IO_UPDATE_DATA, IO_CHAT] = ['update date room', 'chat room'];
const io = new SocketIoServer(httpsServer);
io.on('connection', (socket) => {
	console.log('socket.io connection', socket.id, socket.handshake.address);

	socket.join(IO_UPDATE_DATA);
	socket.join(IO_CHAT);

	const rooms = io.of('/').adapter.rooms;
	const sids = io.of('/').adapter.sids;
	console.log('socket.io rooms', IO_UPDATE_DATA, rooms.get(IO_UPDATE_DATA).size);
	console.log('socket.io rooms', IO_CHAT, rooms.get(IO_CHAT).size);
	console.log('socket.io sids', sids.size);

	socket.on('disconnect', () => {
		console.log('socket.io disconnect', socket.id);
		socket.leave(IO_UPDATE_DATA);
		socket.leave(IO_CHAT);

		const rooms = io.of('/').adapter.rooms;
		const sids = io.of('/').adapter.sids;
		console.log('socket.io rooms', rooms);
		console.log('socket.io sids', sids);
	});

	socket.on(IO_CHAT, (message) => {
		io.to(IO_CHAT).emit(IO_CHAT, socket.id, message, Date.now());
	});

	socket.on('error', (error) => {
		console.error('socket.io socket error', error);
	});
});

process
	.on('update flay', (flay) => {
		io.to(IO_UPDATE_DATA).emit('update flay', flay);
		console.log('emit update flay', flay);
	})
	.on('update actress', (actress) => {
		io.to(IO_UPDATE_DATA).emit('update actress', actress);
		console.log('emit update actress', actress);
	})
	.on('update tag', (tag) => {
		io.to(IO_UPDATE_DATA).emit('update tag', tag);
		console.log('emit update tag', tag);
	});
