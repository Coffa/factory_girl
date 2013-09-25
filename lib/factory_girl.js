(function(FactoryGirl, exports, global) {
	exports.version = '0.0.1';

	exports.define = function(name, callback) {
		if (typeof callback === 'function') {
			exports.datum.setDefined(name, callback);
		} else {
			throw Error('argument must be a function')
		}
	};

	exports.defined = function(name) {
		exports.datum.checkDefined();
	};

	exports.create = function(name) {
		return exports.datum.createFactory(name);
	};

	exports.attributes_for = function(name) {
		var define = exports.datum.getDefined(name),
				model = new exports.Model();
		define.call(model);
		return model.attributes();
	};

	(function(exports, global) {
		exports.datum = new Data();

		var container = {};

		function Data() {
		}

		Data.prototype.checkDefined = function(name) {
			if (!!container[name]) {
				return true;
			} else {
				throw Error(name + ' is not exist');
			}
		}

		Data.prototype.setDefined = function(name, defined) {
			container[name] = {factories: [], defined: defined};
		}

		Data.prototype.getDefined = function(name) {
			this.checkDefined(name);
			return container[name]['defined'];
		}

		Data.prototype.createFactory = function(name) {
			var define = this.getDefined(name),
					factory = new exports.Model();
			container[name]['factories'].push(factory);
			define.call(factory);
			return factory;
		}
	})(exports, global);

	(function(exports, global) {
		exports.Model = Model;

		function Model(opts) {
			if (!(this instanceof Model)) {
				return new Model(opts);
			}
		}

		Model.prototype.attributes = function() {
			var keys = Object.keys(this),
					attrs = {};

			for (var i = keys.length - 1; i >= 0; i--) {
				attrs[keys[i]] = this[keys[i]];
			};
			return attrs;
		}

		Model.prototype.toJSON = function() {
			var keys = Object.keys(this),
					attrs = {};

			for (var i = keys.length - 1, property, key; i >= 0; i--) {
				key = keys[i];
				property = this[key];
				if (property instanceof Array) {
					attrs[key] = attrs[key] || [];
					property.forEach(function(iterate) {
						if (iterate instanceof Model) {
							iterate = iterate.toJSON();
						}
						attrs[key].push(iterate);
					})
				} else if (property instanceof Model) {
					attrs[key] = property.toJSON();
				} else {
					attrs[key] = property;
				}
			};
			return attrs;
		}

		Model.prototype.association = function(name, ref) {
			if (typeof ref === 'undefined') {
				ref = name + '_id';
			}
			var define = exports.datum.getDefined(name);
			var model = new Model();
			define.call(model);
			this[name] = model;
			model[ref] = this.id;
		}

		Model.prototype.create_lists = function(name, num, ref) {
			if (typeof ref === 'undefined') {
				ref = name + '_id';
			}
			var define = exports.datum.getDefined(name),
					lists = [];
			for (var i = num - 1, model; i >= 0; i--) {
				model = new Model();
				define.call(model);
				model[ref] = this.id;
				lists.push(model);
			};
			this[name] = lists;
		}
	})(exports, global);

	FactoryGirl.version = exports.version;
	FactoryGirl.define = exports.define;
	FactoryGirl.defined = exports.defined;
	FactoryGirl.create = exports.create;
	FactoryGirl.attributes_for = exports.attributes_for;
})(FactoryGirl = ('undefined' === typeof module ? {} : module.exports), {}, this)
