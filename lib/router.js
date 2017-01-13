'use strict';

const url = require('url');
const querystring = require('querystring');
const parseBody = require('./parse-body.js');

const Router = module.exports = function(){
  this.routes = {
    GET: {},
    POST:{},
    PUT: {},
    DELETE: {},
  }
}

Router.prototype.get = function(endpoint, callback){
  this.routes.GET[endpoint] = callback;
}

Router.prototype.put = function(endpoint, callback){
  this.routes.PUT[endpoint] = callback;
}

Router.prototype.post = function(endpoint, callback){
  this.routes.POST[endpoint] = callback;
}

Router.prototype.delete = function(endpoint, callback){
  this.routes.DELETE[endpoint] = callback;
}

Router.prototype.route = function(){
  return (req, res) => {
    // do the logic for invoking a route callback
    req.url = url.parse(req.url);
    req.url.query = querystring.parse(req.url.query);

    // parse the body only on PUT AND POST
    parseBody(req)
    .then(body => {

      req.body = body;


      // if we find a callback registered for a route call it
      if(typeof this.routes[req.method][req.url.pathname] == 'function'){
        this.routes[req.method][req.url.pathname](req, res);
        return;
      }

      // if no route callback was found reject a 404 error
      let err = new Error('route not found');
      err.status = 404;
      return Promise.reject(err);

    })
    .catch(err => {
      // all of our errors are going to happen because we say they should
      // otherwise there going to be a 500
      console.error(err);
      if(err.status){
        res.statusCode = err.status;
        res.end();
        return;
      }

      res.status = 500;
      res.end();
    })
    // if post or put request parse the json
  };
}
