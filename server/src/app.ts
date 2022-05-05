import express from 'express';
import { createServer } from 'https';
import { Server as SocketIoServer } from 'socket.io';
import fs from 'fs';
import dotenv from 'dotenv';
import loader from './loaders/index';

dotenv.config();

const app = express();

const httpsServer = createServer(
  {
    pfx: fs.readFileSync('certs/kamoru.jk.p12'),
    passphrase: process.env.SSL_PASSPHRASE,
  },
  app
);

const io = new SocketIoServer(httpsServer);

loader({ expressApp: app, https: httpsServer, socketIo: io });
