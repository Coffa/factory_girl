'use strict';

(function(FactoryGirl, exports, global) {
	exports.version = {
		full: '"VERSION_FULL"',
		major: "VERSION_MAJOR",
		minor: "VERSION_MINOR",
		dot: "VERSION_DOT",
		codeName: '"VERSION_CODENAME"'
	};

	exports.define = function(name) {
		var callback = arguments[arguments.length - 1],
		opts = arguments.length === 3 ? arguments[1] : {};
		if (typeof callback === 'function') {
			exports.datum.setDefined(name, opts, callback);
		} else {
			throw Error('argument must be a function')
		}
	};

	exports.defined = function(name) {
		try { exports.datum.checkDefined() }
		catch(e) { return false }
		return true;
	};

	exports.create = function(name) {
		return exports.datum.createFactory(name);
	};

	exports.createLists = function(name, num) {
		var lists = [];
		while(num--) {
			lists.push(exports.datum.createFactory(name));
		}
		return lists;
	};

	exports.attributesFor = function(name) {
		var define = exports.datum.getDefined(name),
		model = new exports.Model(name);
		define.call(model);
		return model.attributes();
	};

	FactoryGirl.version = exports.version;
	FactoryGirl.define = exports.define;
	FactoryGirl.defined = exports.defined;
	FactoryGirl.create = exports.create;
	FactoryGirl.createLists = exports.createLists;
	FactoryGirl.attributesFor = exports.attributesFor;
})(
	FactoryGirl = (typeof FactoryGirl === 'undefined' ? {} : FactoryGirl),
	exports = (typeof exports === 'undefined' ? {} : exports),
	global
);

