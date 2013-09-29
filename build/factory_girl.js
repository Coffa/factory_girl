/**
 * @license FactoryGirl v0.1.0
 * (c) 2012-2013 Coffa Team https://github.com/Coffa
 * License: MIT
 */

(function(FactoryGirl, libAPI, global) {'use strict';

;(function(libAPI, global) {

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

;(function(libAPI, global) {

var container = {};

	libAPI.datum = new Data();

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
		return factory;
	};

	Data.prototype.remove = function(name) {
		this.checkDefined(name);
		delete container[name];
		return this;
	};

	Data.prototype.clear = function() {
		var prop;
		for(prop in container) {
			if (container.hasOwnProperty(prop)) {
				this.remove(prop);
			}
		}
		return this;
	};
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI), global);

;(function(libAPI, global) {

libAPI.Model = Model;

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
			ref = this.getName() + '_id';
		}
		var model = setAssociation(this, name);
		model[ref] = this.id;
	};

	Model.prototype.hasMany = function(name, num, ref) {
		if (typeof ref === 'undefined') {
			ref = this.getName() + '_id';
		}
		var lists = [];
		for (var i = num - 1, model; i >= 0; i--) {
			model = new Model(name);
			model[ref] = this.id;
			lists.push(model);
		};
		this[name] = lists;
	};

	function setAssociation(obj, name) {
		var model = new Model(name);
		obj[name] = model;
		model[obj.getName()] = obj;
		return model;
	};

	function configModel(obj) {
		var name = obj.getName(),
				opts = libAPI.datum.getOptions(name),
				define = libAPI.datum.getDefined(name);

		define.call(obj);
		setInherit(obj, opts.inherit);
	};

	function setInherit(obj, inherit) {
		if (!!!inherit) return;

		var inheritDefine = libAPI.datum.getDefined(inherit),
				model = new Model(inherit);
		inheritDefine.call(model);
		libAPI.utils.merge(obj, model, true);

		var keys = Object.keys(obj);
		for (var i = keys.length - 1, key, property; i >= 0; i--) {
			key = keys[i];
			property = obj[key];
			if (property instanceof Array) {
				property.forEach(function(iterate) {
					if (iterate instanceof Model && iterate[model.getName() + '_id']) {
						delete iterate[model.getName() + '_id'];
						iterate[obj.getName() + '_id'] = obj.id;
					}
				})
			} else if (property instanceof Model && iterate[model.getName() + '_id']) {
				delete property[model.getName() + '_id'];
				property[obj.getName() + '_id'] = obj.id;
			}
		};
	}
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI), global);

;(function(FactoryGirl, libAPI, global) {

libAPI.version = {
		full: '0.1.0',
		major: 0,
		minor: 1,
		dot: 0,
		codeName: 'black'
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

})(FactoryGirl = ('undefined' === typeof module ? {} : module.exports), {}, this);
