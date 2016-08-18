;(function(libAPI) {
  'use strict';

  libAPI.utils = {};

  libAPI.utils.merge = function(target, source, keep) {
    if (typeof target !== 'object') throw Error('Target must be object');

    for(var prop in source) {
      if (source.hasOwnProperty(prop)) {
        if (typeof(target[prop]) === 'object' && typeof(source[prop]) === 'object') {
          libAPI.utils.merge(target[prop], source[prop], keep);
        } else if (!target.hasOwnProperty(prop) || !keep) {
          target[prop] = source[prop];
        }
      }
    }
  };
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI));
