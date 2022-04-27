import expressLoader from './express.js';
import httpsServerLoader from './httpsServer.js';
import socketIoLoader from './socketio.js';

export default ({ expressApp, https, socketIo }) => {
	expressLoader({ app: expressApp });
	console.log('Express initialized');

	httpsServerLoader({ httpsServer: https });
	console.log('HttpServer initialized');

	socketIoLoader({ io: socketIo });
	console.log('Socket.IO initialized');
};
