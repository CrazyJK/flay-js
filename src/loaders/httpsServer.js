export default ({ httpsServer }) => {
	const port = process.env.PORT || 443;

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
		`);

			setInterval(() => {
				console.debug(`Server memory used ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
			}, 1000 * 60 * 60);
		});

	return httpsServer;
};
