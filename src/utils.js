;(function(libAPI, global) {
	'use strict';

	libAPI.utils = {};
	libAPI.utils.merge = function(target, source, keep) {
		if (typeof target !== 'object') throw Error('Target must be object');

		var prop;

		for(prop in source) {
			if (source.hasOwnProperty(prop)) {
				if (!!!target[prop] || !keep) {
					target[prop] = source[prop];
				}
			}
		}
	};
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI), global);
