;(function(FactoryGirl, libAPI, global) {
	'use strict';

	libAPI.version = {
		full: '"VERSION_FULL"',
		major: "VERSION_MAJOR",
		minor: "VERSION_MINOR",
		dot: "VERSION_DOT",
		codeName: '"VERSION_CODENAME"'
	};

	libAPI.define = function(name) {
		var callback = arguments[arguments.length - 1],
		opts = arguments.length === 3 ? arguments[1] : {};
		if (typeof callback === 'function') {
			libAPI.datum.setDefined(name, opts, callback);
		} else {
			throw Error('argument must be a function')
		}
	};

	libAPI.defined = function(name) {
		try { libAPI.datum.checkDefined(name) }
		catch(e) { return false }
		return true;
	};

	libAPI.create = function(name) {
		return libAPI.datum.createFactory(name);
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

	FactoryGirl.version = libAPI.version;
	FactoryGirl.define = libAPI.define;
	FactoryGirl.defined = libAPI.defined;
	FactoryGirl.create = libAPI.create;
	FactoryGirl.createLists = libAPI.createLists;
	FactoryGirl.attributesFor = libAPI.attributesFor;
	FactoryGirl.clear = libAPI.clear;
})(
	FactoryGirl = (typeof FactoryGirl === 'undefined' ? {} : FactoryGirl),
	libAPI = (typeof libAPI === 'undefined' ? {} : libAPI),
	global
);
