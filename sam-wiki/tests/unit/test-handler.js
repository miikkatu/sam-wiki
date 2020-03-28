'use strict';

const chai = require('chai');

const app = require('../../app.js');
const expect = chai.expect;

let context, event;

describe('Tests index', function() {
  it('verifies failed response', async () => {
    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(400);
    expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.message).to.be.equal('Missing search parameter');
  });

  it('verifies successful response', async () => {
    event = {
      ...event,
      queryStringParameters: {
        search: 'batman',
      },
    };

    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.summary).to.be.an('string');
  });
});
