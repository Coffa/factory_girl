;(function(libAPI) {
  'use strict';

  libAPI.Model = Model;

  function Model(name, attrs) {
    if (!(this instanceof Model)) {
      return new Model(name);
    }
    this.__name__ = name;
    configModel(this, attrs);
  }

  Model.prototype.getName = function() {
    return this.__name__;
  };

  Model.prototype.attributes = function() {
    return this.toJSON(true);
  };

  Model.prototype.toJSON = function(excludeChild, objPrinted) {
    var keys = Object.keys(this), attrs = {};

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
        });
      } else if (property instanceof Model) {
        if (!excludeChild && objPrinted.indexOf(property.getName()) === -1) {
          attrs[key] = property.toJSON(objPrinted);
        }
      } else if (!/^__(.)+__$/.test(key)){
        attrs[key] = property;
      }
    }
    return attrs;
  };

  Model.prototype.belongTo = function(name, factoryName, ref) {
    return setAssociation(this, name, factoryName, ref, true);
  };

  Model.prototype.hasOne = function(name, factoryName, ref) {
    return setAssociation(this, name, factoryName, ref, false);
  };

  Model.prototype.hasMany = function(name, factoryName, num, ref) {
    if (typeof factoryName === 'number') {
      ref = num;
      num = factoryName;
      factoryName = null;
    }
    factoryName = factoryName || name;
    ref = ref || this.getName() + '_id';

    var lists = [];
    for (var i = num - 1, model; i >= 0; i--) {
      model = new Model(factoryName);
      model[ref] = this.id;
      lists.push(model);
    }
    this[name] = lists;
  };

  Model.prototype.sequence = function(seq_name, attr_name) {
    this[attr_name] = libAPI.datum.nextSequence(seq_name);
  };

  return;

  function setAssociation(obj, name, factoryName, ref, flag) {
    var model;

    if (!ref) {
      ref = factoryName;
      factoryName = name;
    }
    ref = ref || (flag ? factoryName : obj.getName()) + '_id';
    model = new Model(factoryName);
    obj[name] = model;
    model[obj.getName()] = obj;
    flag ? obj[ref] = model.id : model[ref] = obj.id;
    return model;
  }

  function configModel(obj, attrs) {
    var name = obj.getName();
    var opts = libAPI.datum.getOptions(name);
    var define = libAPI.datum.getDefined(name);

    define.call(obj);
    libAPI.utils.merge(obj, attrs);
    setInherit(obj, opts.inherit);
  }

  function setInherit(obj, inherit) {
    if (!!!inherit) return;

    var inheritDefine = libAPI.datum.getDefined(inherit);
    var model = new Model(inherit);

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
        });
      } else if (property instanceof Model && property[model.getName() + '_id']) {
        delete property[model.getName() + '_id'];
        property[obj.getName() + '_id'] = obj.id;
      }
    }
  }
})(libAPI = (typeof libAPI === 'undefined' ? {} : libAPI));
