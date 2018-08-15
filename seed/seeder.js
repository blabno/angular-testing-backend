'use strict';

const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');

const config = require('../app/config.js');
const daoUtil = require('../app/daoUtil');
const defaultData = require('./data.json');
const mapping = require('./mapping.json');

const es = new elasticsearch.Client(config.es.options);
const promiseMapOptions = { concurrency: config.es.concurrentRequests };

async function assignAlias(oldIndex, newIndex, type) {
  const alias = daoUtil.getIndexName(type);
  const exists = await es.indices.existsAlias({ index: oldIndex, name: alias });
  if (exists) {
    await es.indices.deleteAlias({ index: oldIndex, name: alias });
  }
  await es.indices.putAlias({ index: newIndex, name: alias });
}

async function createIndex(index, type) {
  await es.indices.create({ index, body: { mappings: { [type]: mapping[type] } } });
}

function getAllIndexes() {
  return es.indices.get({ index: '_all' });
}

async function getIndexesByType(type) {
  const indexes = await getAllIndexes();
  const indexName = daoUtil.getIndexName(type);
  return Object.keys(indexes).filter(index => Object.keys(indexes[index].aliases).includes(indexName));
}

async function recreateIndex(type) {
  const index = `${daoUtil.getIndexName(type)}-001`;
  await removeIndexesByType(type);
  await createIndex(index, type);
  await assignAlias(null, index, type);
}

function recreateIndexes() {
  return Promise.map(Object.keys(mapping), recreateIndex, promiseMapOptions);
}

async function refreshIndexes() {
  const indexes = Object.keys(await getAllIndexes());
  return es.indices.refresh({ index: indexes });
}

async function removeIndex(index) {
  await es.indices.delete({ index });
}

async function removeIndexesByType(type) {
  const indexes = await getIndexesByType(type);
  await Promise.map(indexes, index => removeIndex(index), promiseMapOptions);
}

async function seedData(data = defaultData) {
  await Promise.map(Object.keys(data), type => {
    const fixture = data[type];
    if (!fixture) {
      return null;
    }
    return Promise.map(fixture, async record => {
      const body = { ...record };
      delete body.id;
      return await es.index(daoUtil.getParams(type, { id: record.id, body }));
    }, promiseMapOptions);
  }, promiseMapOptions);
}

async function seedFixture(fixture) {
  await refreshIndexes();
  await Promise.map(Object.keys(mapping), async type => {
    const index = `${daoUtil.getIndexName(type)}-001`;
    await es.deleteByQuery({ index, refresh: true, body: { query: { match_all: {} } } });
  }, promiseMapOptions);
  await Promise.map(Object.keys(fixture), type => seedData({ [type]: fixture[type] }), promiseMapOptions);
  await refreshIndexes();
}

module.exports = {
  recreateIndexes,
  seedData,
  seedFixture
};
