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
  let noteIDs = [];

  return fs.statMeh(`${dataDir}/${name}`)
  .catch((err) => {
    err = createError(404, 'no items registered yet');
    return Promise.reject(err);
  })
  .then(() => {
    return fs.readdirMeh(`${dataDir}/${name}`, 'utf8')
  })
  .then((data) => {
    console.log(data);
    console.log('what the fuck are you?', typeof data);
    data = data.join('').split('.json').slice(0, data.length);
    console.log('did I split right?', data);
    data = JSON.stringify(data);
    return data;
  })

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
