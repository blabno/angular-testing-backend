'use strict';

const expect = require('chai').expect;

const seeder = require('../seed/seeder');

describe('GET /api/quote-for-today', () => {
  let supertest;
  let body, statusCode;
  let quote;

  const callApi = async () => {
    ({ body, statusCode } = await supertest.get('/api/quote-for-today'));
  };

  before(function () {
    supertest = this.supertest;
  });
  before(async () => {
    quote = `${Math.random()}`;

    const fixtures = {
      quote: [{ text: quote, id: 'quote-for-today' }]
    };
    await seeder.seedFixture(fixtures);
  });

  beforeEach(() => callApi());
  it('should reply with 200 status code', () => expect(statusCode).to.equal(200));
  it('should reply with quote from db', () => expect(body).to.eql({ text: quote }));
});
