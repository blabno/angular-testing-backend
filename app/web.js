'use strict';

const createServer = require('./createServer');


(async () => {
  const server = await createServer();
  await server.start();
  server.log('info', `Server running at: ${server.info.uri}`);
})();
