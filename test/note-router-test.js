'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');
const Note = require('../model/note.js');
const storage = require('../lib/storage.js');

require('../servers.js');


const apiURL = `http://localhost:3000/api/notes`;

let id;

describe('testing /api/notes', function(){


  before((done) => {
    this.tempNote = new Note({title: 'hello', content: 'world'});
    storage.setItem('notes', this.tempNote)
    .then(() => done())
    .catch(done);
  });

  describe('POST with valid input', () => {
    it('POST with valid input and should return a note', (done) => {
      superagent.post(`${apiURL}`)
      .send(this.tempNote)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('hello');
        expect(res.body.content).to.equal('world');
        expect(Boolean(res.body.created)).to.equal(true);
        expect(Boolean(res.body.id)).to.equal(true);
        res.body.id = id;
        done();
      })
      .catch(done);
    });
  });

  describe('POST /api/notes with invalid input', () => {
    it('should return a 400 for no invalid input', (done) => {
      superagent.post(`${apiURL}`)
      .send({title: 'hahaha', content: null})
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(400);
        done();
      });
    });
  });

  describe('GET /api/notes/?id=# with valid input', () => {
    it('should return 200 and a note for good id#', (done) => {

      superagent.get(`${apiURL}?id=${this.tempNote.id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      })
      .catch((done));
    });
  });

  describe('GET /api/notes?id=# with INVALID input', () => {
    it('should return a 404 for bad id#', (done) => {
      superagent.get(`${apiURL}?id=1234`)
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });

  describe('GET /api/notes with NO id', () => {
    it('should return a 400 for no ID#', (done) => {
      superagent.get(`${apiURL}`)
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(400);
        done();
      });
    });
  });

  describe('GET /api/notes/ids', () => {
    it('should return an array of IDs', (done) => {
      superagent.get(`${apiURL}/ids`)
      .then((res) => {
        expect(res.body).to.be.instanceof(Array);
        expect(res.body[0]).to.equal(this.tempNote.id);
        done();
      })
      .catch((done));
    });
  });
  describe('DELETE /api/notes/?id', () => {
    it('should have status 204 and succesfully delete the item', (done) => {
      superagent.delete(`${apiURL}?id=${this.tempNote.id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((done));
    });
  });

});
