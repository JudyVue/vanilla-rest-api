'use strict';

const uuidv1 = require('node-uuid').v1;

module.exports = function (opts){
  this.title = opts.title;
  this.content = opts.content;
  this.id = uuidv1();
  this.created = new Date();
}

