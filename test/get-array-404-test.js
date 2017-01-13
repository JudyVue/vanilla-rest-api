'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

require('../servers.js');


const apiURL = `http://localhost:3000/api/notes`;


//GET expecting 404 for no array of IDs available
describe('GET /api/notes/ids with no IDs available', function() {
  it('should return a 404 because no IDs available', (done) => {
    superagent.get(`${apiURL}/ids`)
    .then(done)
    .catch((err) => {
      expect(err.status).to.equal(404);
      done();
    });
  });
});
