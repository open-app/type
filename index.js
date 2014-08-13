var debug = require('debug')('oa-type');
var jjv = require('jjv');
var validUrl = require('valid-url');
var _ = require('lodash');

var isSchema = require('schema-is-schema');
var schemaDeRef = require('schema-deref');
var schemaHasRef = require('schema-has-ref');
var schemaJsonldContext = require('schema-jsonld-context');
var schemaPrefixUri = require('schema-prefix-uri');

function Type (options) {
  debug("constructor", options);
  // call new constructor if not already
  if (!(this instanceof Type)) {
    return new Type(options);
  }

  var schema = schemaPrefixUri(options.base, options.schema);  

  var schemaErrs = isSchema(schema);
  if (schemaErrs !== true) {
    var err = new Error("options.schema is not a valid schema");
    err.errors = schemaErrs;
    throw err;
  }

  // save raw schema
  this.schema = schema;
  // save id
  this.id = this.schema.id;

  // save jjv environment
  this.env = options.env || jjv();

  // add schema to jjv environment
  this.env.addSchema(this.id, this.schema);
  // TODO add types
  // TODO add type coercions
  // TODO add checks
  // TODO add formats
  
  // store relations
  this.relations = _.omit(this.schema.properties, function (value, key) {
    return !schemaHasRef(value);
  }.bind(this));
}

Type.prototype.validate = function (obj) {
  return this.env.validate(this.id, obj)
};

Type.prototype.context = function () {
  return schemaJsonldContext(
    schemaDeRef(this.env.schema, this.schema)
  );
}

Type.isType = require('./isType');

module.exports = Type;
