import expressLoader from './express';
import httpsServerLoader from './httpsServer';
import socketIoLoader from './socketio';

export default ({ expressApp, https, socketIo }) => {
  expressLoader({ app: expressApp });
  console.log('Express initialized');

  httpsServerLoader({ httpsServer: https });
  console.log('HttpServer initialized');

  socketIoLoader({ io: socketIo });
  console.log('Socket.IO initialized');
};
