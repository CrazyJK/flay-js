import { Server } from "socket.io";
import ioEmitter from '../routes/ioEmitter';

export default ({ io }: {
  io: Server;
}) => {
  const [ROOM_UPDATE_DATA, ROOM_CHAT] = ['update date room', 'chat room'];

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

    socket.on(ROOM_CHAT, (message) => {
      io.to(ROOM_CHAT).emit(ROOM_CHAT, socket.id, message, Date.now());
    });

    socket.on('error', (error) => {
      console.error('socket.io socket error', error);
    });
  });

  // process
  //   .on('update flay', (flay) => {
  //     io.to(IO_UPDATE_DATA).emit('update flay', flay);
  //     console.log('emit update flay', flay);
  //   })
  //   .on('update actress', (actress) => {
  //     io.to(IO_UPDATE_DATA).emit('update actress', actress);
  //     console.log('emit update actress', actress);
  //   })
  //   .on('update tag', (tag) => {
  //     io.to(IO_UPDATE_DATA).emit('update tag', tag);
  //     console.log('emit update tag', tag);
  //   });

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

  return io;
};
