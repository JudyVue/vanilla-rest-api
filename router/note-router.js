'use strict';

const storage = require('../lib/storage.js');
const Note = require('../model/note.js');

module.exports = function(router){

  router.post('/api/notes', function(req, res){
    // Step one: create a note
    // Step two: store note
    //   on success: send note back
    //   on failer: send error back
    console.log(req.body, 'req.body in note-router 13');
    if(!req.body.content || !req.body.title){
      let err = new Error('You forgot to add a title or content.');
      console.error(err);
      res.statusCode = 400; // bad request
      res.end();
      return;
    }

    let note = new Note(req.body);

    storage.setItem('notes', note)
    .then(note => {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(note));
      res.end();
    })
    .catch(err => {
      // make better errors
      console.error(err);
      res.statusCode = 400;
      res.end();
    });
  });

  router.get('/api/notes', function(req, res){
    let id = req.url.query.id;
    // TODO: put logic right here for a 400 if no id
    if(!id){
      let err = new Error('You need to put an ID in.');
      console.error(err);
      res.statusCode = 400;
      res.end();
      return;
    }

    storage.getItem('notes', id)
    .then(note => {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(note));
      res.end();
    })
    .catch(err => {
      // make better errors
      // TODO:  put logic in here for a 404 if getItem didnt find a note
      console.error(err);
      res.statusCode = err.status || 500;
      res.end();
    });
  });

  router.delete('/api/notes', function(req, res){
    let id = req.url.query.id;
    if(!req.url.query.id){
      let err = new Error('ID does not exist.');
      console.error(err);
      res.statusCode = 400;
      res.end();
    }

    storage.deleteItem('notes', id)
    .then((status) =>{
      console.log(status, 'status 75 of note-router');
      res.statusCode = status;
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = err.status;
      console.error(err);
      res.end();
    });
  });

  router.get('/api/notes/ids', function(req, res){
    storage.getIDs('notes')
    .then((ids)=> {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(ids);
      res.end();
    })
    .catch((err) => {
      res.statusCode = err.status;
      console.error(err);
      res.end();
    });
  });
};
