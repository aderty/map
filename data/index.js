/// <reference path="~/lib/node-vsdoc.js" />

/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , url = require('url')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , zlib = require('zlib')
  , Users = require('./Users')
  , RdvList = require('./RdvList');

var DAL = {
    init: function (connectionString) {
        mongoose.connect(connectionString);
    },
    db: function () {
        return mongoose.connection.db;
    },
    Users: new Users(),
    RdvList: new RdvList()
}
exports.DAL = DAL;