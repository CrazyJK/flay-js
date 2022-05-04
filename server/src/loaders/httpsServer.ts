import { Server } from "https";

export default ({ httpsServer }: {
  httpsServer: Server;
}) => {
  const port = process.env.PORT || 443;

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
    `);

      setInterval(() => {
        console.debug(`Server memory used ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
      }, 1000 * 60 * 60);
    });

  return httpsServer;
};
