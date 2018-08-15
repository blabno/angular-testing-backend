'use strict';

const Promise = require('bluebird');
const $http = require('http-as-promised');

const config = require('../app/config');

function checkElasticSearch() {
  function connect() {
    return $http.get(config.es.options.host).then(() => console.info('Successfully connected to ElasticSearch'));
  }

  return connect().catch(() => Promise.delay(1000).then(checkElasticSearch));
}

module.exports = async function (timeout) {
  console.info('Waiting for elasticsearch to become available...');
  await checkElasticSearch().timeout(timeout, 'Timeout waiting for elasticsearch to become available');
};
