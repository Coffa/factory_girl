/**
 * @license FactoryGirl v0.1.0
 * (c) 2012-2013 Coffa Team https://github.com/Coffa
 * License: MIT
 */

(function(FactoryGirl, exports, global) {'use strict';

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

(function(exports, global) {
	exports.datum = new Data();

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
		factory = new exports.Model(name);
		container[name]['factories'].push(factory);
		define.call(factory);
		return factory;
	};
})(exports = (typeof exports === 'undefined' ? {} : exports), global);

(function(exports, global) {
	exports.Model = Model;

	function Model(name) {
		if (!(this instanceof Model)) {
			return new Model(name);
		}
		this.__name__ = name;
		configModel(this);
	};

	Model.prototype.getName = function() {
		return this.__name__;
	};

	Model.prototype.attributes = function() {
		return this.toJSON(true);
	};

	Model.prototype.toJSON = function(excludeChild, objPrinted) {
		var keys = Object.keys(this),
		attrs = {};
		if (typeof objPrinted === 'undefined' || !(objPrinted instanceof Array)) {
			objPrinted = [];
		}
		objPrinted.push(this.getName());

		for (var i = keys.length - 1, property, key; i >= 0; i--) {
			key = keys[i];
			property = this[key];
			if (property instanceof Array) {
				property.forEach(function(iterate) {
					if (iterate instanceof Model) {
						if (excludeChild || objPrinted.indexOf(iterate.getName()) !== -1) return;
						iterate = iterate.toJSON(objPrinted);
					}
					attrs[key] = attrs[key] || [];
					attrs[key].push(iterate);
				})
			} else if (property instanceof Model) {
				if (!excludeChild && objPrinted.indexOf(property.getName()) === -1) {
					attrs[key] = property.toJSON(objPrinted);
				}
			} else if (!/^__(.)+__$/.test(key)){
				attrs[key] = property;
			}
		};
		return attrs;
	};

	Model.prototype.belongTo = function(name, ref) {
		if (typeof ref === 'undefined') {
			ref = name + '_id';
		}
		var model = setAssociation(this, name);
		this[ref] = model.id;
	};

	Model.prototype.hasOne = function(name, ref) {
		if (typeof ref === 'undefined') {
			ref = this.__name__ + '_id';
		}
		var model = setAssociation(this, name);
		model[ref] = this.id;
	};

	Model.prototype.hasMany = function(name, num, ref) {
		if (typeof ref === 'undefined') {
			ref = this.__name__ + '_id';
		}
		var define = exports.datum.getDefined(name),
		lists = [];
		for (var i = num - 1, model; i >= 0; i--) {
			model = new Model(name);
			define.call(model);
			model[ref] = this.id;
			lists.push(model);
		};
		this[name] = lists;
	};

	function setAssociation(obj, name) {
		var define = exports.datum.getDefined(name);
		var model = new Model(name);
		define.call(model);
		obj[name] = model;
		model[obj.__name__] = obj;
		return model;
	};

	function configModel(obj) {
		var name = obj.getName(),
		opts = exports.datum.getOptions(name);
		if (opts.inherit) {
			var define = exports.datum.getDefined(opts.inherit),
			model = new Model(opts.inherit);
			define.call(obj);
			exports.utils.merge(obj, model, true);
		}
	};
})(exports = (typeof exports === 'undefined' ? {} : exports), global);

(function(FactoryGirl, exports, global) {
	exports.version = {
		full: '0.1.0',
		major: 0,
		minor: 1,
		dot: 0,
		codeName: 'black'
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



})(FactoryGirl = ('undefined' === typeof module ? {} : module.exports), {}, this);
