;(function(libAPI) {
  'use strict';

  var container = {};
  var sequences = {};

  libAPI.datum = new Data();

  function Data() {}

  Data.prototype.checkDefined = function(name) {
    if (container[name]) {
      return true;
    } else {
      throw Error(name + ' is not defined');
    }
  };

  Data.prototype.setDefined = function(name, opts, defined) {
    this.setAlias(opts, defined);
    container[name] = {factories: [], options: opts, defined: defined};
  };

  Data.prototype.setAlias = function(opts, defined) {
    var alias = opts.alias || [];
    delete opts.alias;
    if (alias instanceof Array) {
      for (var i = alias.length - 1; i >= 0; i--) {
        this.setDefined(alias[i], opts, defined);
      }
    } else {
      this.setDefined(alias, opts, defined);
    }
  };

  Data.prototype.getOptions = function(name) {
    this.checkDefined(name);
    return container[name]['options'];
  };

  Data.prototype.getDefined = function(name) {
    this.checkDefined(name);
    return container[name]['defined'];
  };

  Data.prototype.createFactory = function(name, attrs) {
    var factory = new libAPI.Model(name, attrs);

    container[name]['factories'].push(factory);
    return factory;
  };

  Data.prototype.remove = function(name) {
    this.checkDefined(name);
    delete container[name];
    return this;
  };

  Data.prototype.clear = function() {
    for(var prop in container) {
      if (container.hasOwnProperty(prop)) {
        this.remove(prop);
      }
    }
    return this;
  };

  Data.prototype.count = function() {
    return Object.keys(container).length;
  };

  Data.prototype.setSequence = function(name, callback) {
    sequences[name] = {constructor: callback, next_id: 0};
  };

  Data.prototype.nextSequence = function(name) {
    sequences[name]['next_id'] += 1;
    return sequences[name]['constructor'](sequences[name]['next_id']);
  };
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI));
