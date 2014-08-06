var debug = require('debug')('oa-type');
var extend = require('xtend');
var _ = require('lodash');
var Env = require('jjv');

var merge = require('./lib/merge');

function Types (types) {
  Env.call(this);

  this.types = types || {};
  this.contexts = {};
  this.relations = {};
}

// Types extends Env
var EnvPrototype = Object.create(Env.prototype);
Types.prototype = extend(Object.create(Env.prototype), {
  addDataType: EnvPrototype.addType,
  addDataTypeCoercion: EnvPrototype.addTypeCoercion,
  addType: function (name, type) {
    
  },
});
Types.prototype.constructor = Types;

Types.prototype.addType = 

function typeExtension (Env) {
  debug("typeExtension", Env);

  Env.prototype.addType = addType;



  return Env;
}

function addType (schema) {
  debug("addType", schema);

  // save merged schema
  this.merged = merge(env, schema);

  // add schema to jjv environment
  env.addSchema(this.id, this.schema);
  // TODO add types
  // TODO add type coercions
  // TODO add checks
  // TODO add formats
  
  // store relations
  this.relations = _.omit(this.schema.properties, function (value, key) {
    if (value && value.$ref) {
      return false;
    } else if (value && value.items && value.items.$ref) {
      return false
    }
    return true;
  });
}

Type.prototype.validate = function (obj) {
  return this.env.validate(this.id, obj)
};

Type.prototype.context = function () {
  // create context to return
  var context = {};

  // get prefixes
  _.forIn(this.merged.prefixes, function (val, key) {
    if (typeof key === 'string' && key.length === 0) {
      key = "@vocab";
    }
    context[key] = val;
  });

  // get top-level context
  if (this.merged.context) {
    context[this.schema.id] = this.merged.context;
  }

  // get property contexts
  _.forIn(this.merged.properties, function (propSchema, propName) {
    if (propSchema.context) {
      context[propName] = propSchema.context;
    }
  });

  // TODO merge context of nested objects
  // TODO merge context of nested references

  // strip when key, value is the same
  return _.omit(context, function (value, key) {
    return key === value;
  });
};

Type.isType = require('./isType');

module.exports = Type;
