;(function(libAPI, global) {
	'use strict';

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
