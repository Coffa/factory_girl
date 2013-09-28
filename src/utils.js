'use strict';

(function(exports, global) {
	exports.utils = {};
	exports.utils.merge = function(target, source, keep) {
		var prop;

		for(prop in source) {
			if (source.hasOwnProperty(prop)) {
				if (!!!target[prop] || !keep) {
					target[prop] = source[prop];
				}
			}
		}
	};
})(exports = (typeof exports === 'undefined' ? {} : exports), global);
