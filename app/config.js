'use strict';
const Promise = require('bluebird');

module.exports = {
  es: {
    index: 'angular-testing',
    options: {
      defer: () => Promise.defer(),
      apiVersion: '6.2',
      host: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      requestTimeout: process.env.ELASTICSEARCH_REQUEST_TIMEOUT
    },
    concurrentRequests: parseInt(process.env.ES_CONCURRENT_REQUESTS, 10) || 200
  },
  port: process.env.PORT || 3000
};
