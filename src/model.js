'use strict';

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
