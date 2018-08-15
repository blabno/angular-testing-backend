'use strict';

const Promise = require('bluebird');

const config = require('../app/config');
const data = require('./data');
const mapping = require('./mapping');
const seeder = require('./seeder');

const promiseMapOptions = { concurrency: config.es.concurrentRequests };

async function processType(type) {
  await seeder.seedData({ [type]: data[type] });
  console.info(`Type '${type}' seeded`);
}

(async () => {
  try {
    await seeder.recreateIndexes();
    await Promise.map(Object.keys(mapping), processType, promiseMapOptions);
    console.info('Seed complete');
  } catch (error) {
    console.error(error.stack || error);
  }
})();
