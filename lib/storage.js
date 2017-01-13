'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Meh'})
const mkdirp = require('mkdirp-bluebird');
const createError = requre('http-errors');

const data = {};

const storage = module.exports = {};
const dataDir = `${__dirname}/..data`

storage.setItem = function(name, item){
  return fs.statMeh(`${dataDir}/${name}`)
  .catch(() => {
    return mkdirp(`${dataDir}/${name}`);
  })
  .then(() => {
    let json = JSON.stringify(item);
    return fs.writeFileMeh(`${dataDir}/${name}/${item.id}.json`, json);
  })
  .then(() => item);
}

storage.getItem = function(name, id){

  if (!data[name] || !data[name][id]) {
    let err = new Error('item not found');
    err.status = 404;
    return Promise.reject(err);
  }

  return Promise.resolve(data[name][id]);
};

storage.getIDs = function(name){
  if(!data[name]){
    let err = new Error('no items registered yet');
    err.status = 404;
    return Promise.reject(err);
  }

  let noteIDs = [];

  for(let key in data[name]){
    noteIDs.push(data[name][key].id);
  }
  noteIDs = JSON.stringify(noteIDs);
  return Promise.resolve(noteIDs);

};

storage.deleteItem = function(name, id){

  if (!data[name] || !data[name][id]) {
    let err = new Error('item not found');
    err.status = 404;
    return Promise.reject(err);
  }
  delete data[name][id];
  return Promise.resolve();
}

//storage.setItem('notes', {id: 'lulwat' ...})
