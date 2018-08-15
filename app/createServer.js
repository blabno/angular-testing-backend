const hapi = require('hapi');

const daoUtil = require('./daoUtil');

async function createServer() {
  const server = await new hapi.Server({
    port: process.env.PORT || 3000,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/quote-for-today',
    handler() {
      const id = 'quote-for-today';
      let params = daoUtil.getParams('quote', { id });
      return daoUtil.getElasticSearchClient().get(params)
        .then(result => result._source)
        .catch(error => {
          if (404 === error.status) {
            return { text: '' };
          }
          throw error;
        });
    }
  });

  return server;
}

module.exports = createServer;
