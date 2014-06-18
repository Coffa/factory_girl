;(function(FactoryGirl, libAPI) {
  'use strict';

  libAPI.version = {
    full: '"VERSION_FULL"',
    major: "VERSION_MAJOR",
    minor: "VERSION_MINOR",
    dot: "VERSION_DOT",
    codeName: '"VERSION_CODENAME"'
  };

  libAPI.define = function(name) {
    var callback = arguments[arguments.length - 1];
    var opts = arguments.length === 3 ? arguments[1] : {};

    if (typeof callback === 'function') {
      libAPI.datum.setDefined(name, opts, callback);
    } else {
      throw Error('argument must be a function');
    }
  };

  libAPI.defined = function(name) {
    try { libAPI.datum.checkDefined(name); }
    catch(e) { return false; }
    return true;
  };

  libAPI.create = function(name, attrs) {
    return libAPI.datum.createFactory(name, attrs);
  };

  libAPI.createLists = function(name, num) {
    var lists = [];

    while(num--) {
      lists.push(libAPI.datum.createFactory(name));
    }
    return lists;
  };

  libAPI.attributesFor = function(name) {
    var model = new libAPI.Model(name);

    return model.attributes();
  };

  libAPI.clear = function(name) {
    if (name) {
      libAPI.datum.remove(name);
    } else {
      libAPI.datum.clear();
    }
  };

  libAPI.sequence = function(name, callback) {
    if (typeof callback === 'function') {
      libAPI.datum.setSequence(name, callback);
    } else {
      throw Error('argument must be a function');
    }
  };

  libAPI.findDefinitions = function() {
    if (!(FactoryGirl.definitionFilePaths instanceof Array)) {
      throw Error('FactoryGirl.definitionFilePaths must be an array');
    }

    if ('undefined' === typeof require) {
      throw Error('FactoryGirl.findDefinitions is not available on browser');
    }

    var fs = require('fs');
    var path = require('path');

    FactoryGirl.definitionFilePaths.forEach(function(defintionPath) {
      fs.readdirSync(defintionPath).forEach(function(file) {
        require(path.join(defintionPath, file));
      });
    });
  };

  FactoryGirl.version = libAPI.version;
  FactoryGirl.define = libAPI.define;
  FactoryGirl.defined = libAPI.defined;
  FactoryGirl.create = libAPI.create;
  FactoryGirl.createLists = libAPI.createLists;
  FactoryGirl.attributesFor = libAPI.attributesFor;
  FactoryGirl.clear = libAPI.clear;
  FactoryGirl.sequence = libAPI.sequence;
  FactoryGirl.findDefinitions = libAPI.findDefinitions;
})(
  FactoryGirl = (typeof FactoryGirl === 'undefined' ? {} : FactoryGirl),
  libAPI = (typeof libAPI === 'undefined' ? {} : libAPI)
);
