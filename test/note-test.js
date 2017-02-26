'use strict';

const expect = require('chai').expect;
const Note = require('../model/note.js');

describe('testing note model', function(){
  it('should create a note', function(){
    let data = {
      title: 'hello',
      content: 'world',
    };

    let tempNote = new Note(data);
    expect(Boolean(tempNote.id)).to.equal(true);
    expect(tempNote.created instanceof Date).to.equal(true);
    expect(tempNote.title).to.equal(data.title);
    expect(tempNote.content).to.equal(data.content);
  });
});
