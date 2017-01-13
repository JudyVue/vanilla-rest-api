'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Meh'})
const mkdirp = require('mkdirp-bluebird');
const createError = require('http-errors');

const data = {};

const storage = module.exports = {};
const dataDir = `${__dirname}/../data`

storage.setItem = function(name, item){
  return fs.statMeh(`${dataDir}/${name}`)
  .catch(() => {
    return mkdirp(`${dataDir}/${name}`);
  })
  .then(() => {
    let json = JSON.stringify(item);
    return fs.writeFileMeh(`${dataDir}/${name}/${item.id}.json`, json);
  })
  .then(() => {
    return item;
  })
}

storage.getItem = function(name, id){
  return fs.statMeh(`${dataDir}/${name}/${id}.json`)
  .catch((err) => {
    err = createError(404, 'No item with that ID number');
    return Promise.reject(err);
  })
  .then(() => {
    return fs.readFileMeh(`${dataDir}/${name}/${id}.json`)
  })
  .then((item) => {
    return JSON.parse(item.toString());
  })
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
  return fs.statMeh(`${dataDir}/${name}/${id}.json`)
  .catch((err) => {
    err = createError(404, 'item ID not found');
    return Promise.reject(err);
  })
  .then(() => {
    return fs.unlinkMeh(`${dataDir}/${name}/${id}.json`);
  })
  .then((status) => {
    status = 204;
    return status
  })
}

//storage.setItem('notes', {id: 'lulwat' ...})
