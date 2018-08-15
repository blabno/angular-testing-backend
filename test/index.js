'use strict';

const supertestFactory = require('supertest');

const createServer = require('../app/createServer');
const seeder = require('../seed/seeder');
const waitForDependencies = require('./waitForDependencies');

const INIT_TESTS_TIMEOUT = 60000;

before(async function () {
  this.server = await createServer();
  this.supertest = supertestFactory(this.server.info.uri);
  await this.server.start();
  await waitForDependencies(INIT_TESTS_TIMEOUT);
  await seeder.recreateIndexes();
});

after(async function () {
  await this.server.stop();
});

