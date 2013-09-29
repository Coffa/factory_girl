;(function(libAPI, global) {
	'use strict';

	libAPI.datum = new Data();

	var container = {};

	function Data() {};

	Data.prototype.checkDefined = function(name) {
		if (!!container[name]) {
			return true;
		} else {
			throw Error(name + ' is not exist');
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
			};
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

	Data.prototype.createFactory = function(name) {
		var define = this.getDefined(name),
		factory = new libAPI.Model(name);
		container[name]['factories'].push(factory);
		define.call(factory);
		return factory;
	};

	Data.prototype.remove = function(name) {
		this.checkDefined(name);
		delete container[name];
	};

	Data.prototype.clear = function() {
		for(prop in container) {
			if (container.hasOwnProperty(prop)) {
				this.remove(prop);
			}
		}
	};
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI), global);
