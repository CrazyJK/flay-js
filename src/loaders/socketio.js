export default ({ io }) => {

    const [IO_UPDATE_DATA, IO_CHAT] = ['update date room', 'chat room'];

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

    return io;
}