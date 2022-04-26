import express, { json, NextFunction, urlencoded, ErrorRequestHandler } from 'express';
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

import indexRouter from './routes/indexRouter';
import flayViewRouter from './routes/flayViewRouter';
import flayApiRouter from './routes/flayApiRouter';
import Flay from './flayground/domain/Flay';
import ioEmitter from './routes/ioEmitter';

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
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	// console.log(req.headers);
	const resErr = {
		isXhr: req.headers['x-requested-with'] === 'XMLHttpRequest' || (req.headers.accept && req.headers.accept.indexOf('json') > -1),
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
};
app.use(errorHandler);

const serverOptions = {
	pfx: fs.readFileSync('certs/kamoru.jk.p12'),
	passphrase: '697489',
};

const httpsServer = createServer(serverOptions, app);
httpsServer
	.listen(port)
	.on('error', (error) => {
		console.error('server error', error);
	})
	.on('listening', () => {
		const addr = httpsServer.address();
		const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
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

interface ServerToClientEvents {
	chatFromRoom: (message: string) => void;
}
interface ClientToServerEvents {
	chatToRoom: (id: string, message: string, date: number) => void;
	updateFlay: (flay: Flay) => void;
	updateActress: (actress: object) => void;
	updateTag: (tag: object) => void;
}

const [ROOM_UPDATE_DATA, ROOM_CHAT] = ['update date room', 'chatRoom'];
const io = new SocketIoServer<ServerToClientEvents, ClientToServerEvents>(httpsServer);
io.on('connection', (socket) => {
	console.log('socket.io connection', socket.id, socket.handshake.address);

	socket.join(ROOM_UPDATE_DATA);
	socket.join(ROOM_CHAT);

	const rooms = io.of('/').adapter.rooms;
	const sids = io.of('/').adapter.sids;
	console.log('socket.io rooms', ROOM_UPDATE_DATA, rooms.get(ROOM_UPDATE_DATA)?.size);
	console.log('socket.io rooms', ROOM_CHAT, rooms.get(ROOM_CHAT)?.size);
	console.log('socket.io sids', sids.size);

	socket.on('disconnect', () => {
		console.log('socket.io disconnect', socket.id);
		socket.leave(ROOM_UPDATE_DATA);
		socket.leave(ROOM_CHAT);

		const rooms = io.of('/').adapter.rooms;
		const sids = io.of('/').adapter.sids;
		console.log('socket.io rooms', rooms);
		console.log('socket.io sids', sids);
	});

	socket.on('chatFromRoom', (message: string) => {
		io.to(ROOM_CHAT).emit('chatToRoom', socket.id, message, Date.now());
	});

	socket.on('error', (error) => {
		console.error('socket.io socket error', error);
	});
});

// process
// 	.on('updateFlay', (flay) => {
// 		io.to(ROOM_UPDATE_DATA).emit('updateFlay', flay);
// 		console.log('emit update flay', flay);
// 	})
// 	.on('updateActress', (actress) => {
// 		io.to(ROOM_UPDATE_DATA).emit('updateActress', actress);
// 		console.log('emit update actress', actress);
// 	})
// 	.on('updateTag', (tag) => {
// 		io.to(ROOM_UPDATE_DATA).emit('updateTag', tag);
// 		console.log('emit update tag', tag);
// 	});

ioEmitter.flay.on('updateFlay', (flay) => {
	io.to(ROOM_UPDATE_DATA).emit('updateFlay', flay);
	console.log('emit update flay', flay);
});
ioEmitter.actress.on('updateActress', (actress) => {
	io.to(ROOM_UPDATE_DATA).emit('updateActress', actress);
	console.log('emit update actress', actress);
});
ioEmitter.tag.on('updateTag', (tag) => {
	io.to(ROOM_UPDATE_DATA).emit('updateTag', tag);
	console.log('emit update tag', tag);
});
