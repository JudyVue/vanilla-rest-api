'use strict';

const http = require('http');
const PORT = process.env.PORT || 3000;

const Router = require('./lib/router.js');
const noteRouter = require('./router/note-router.js');

let router = new Router();

noteRouter(router);


const server = http.createServer(router.route());

server.listen(PORT, () => {
  console.log('server up (::)-<-<',PORT);
});
