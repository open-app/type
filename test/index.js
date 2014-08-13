var expect = require('chai').expect;
var jjv = require('jjv');

var schemaPrefixUri = require('schema-prefix-uri');

var person = {
  id: "Person",
  prefixes: {
    "": "http://schema.org/",
    foaf: "http://xmlns.com/foaf/0.1/",
    org: "http://www.w3.org/TR/vocab-org#",
  },
  type: 'object',
  properties: {
    name: {
      type: "string",
      context: "foaf:name",
    },
    memberships: {
      type: "array",
      context: "org:hasMembership",
      items: {
        reverse: "member",
        $ref: "Membership",
      },
    },
  },
};

var membership = {
  id: "Membership",
  prefixes: {
    "": "http://schema.org/",
    foaf: "http://xmlns.com/foaf/0.1/",
    org: "http://www.w3.org/TR/vocab-org#",
  },
  type: 'object',
  context: "org:Membership",
  properties: {
    member: {
      context: "org:member",
      oneOf: [{
        $ref: "Person",
      }, {
        $ref: "Group",
      }],
    },
  },
};

var group = {
  id: "Group",
  prefixes: {
    "": "http://schema.org/",
    org: "http://www.w3.org/TR/vocab-org#",
  },
  type: 'object',
  context: "org:Organization",
  properties: {
    name: {
      type: "string",
      context: "foaf:name",
    },
    memberships: {
      type: "array",
      context: "org:hasMembership",
      items: {
        reverse: "member",
        $ref: "Membership",
      },
    },
  },
};

var base = "http://example.org/";

describe("#oa-type", function () {
  var env;
  var Type;
  var types = {};

  before(function () {
    env = jjv();
  });

  it("should require module", function () {
    Type = require('../');
    expect(Type).to.exist;
  });

  it("should create person type", function () {
    var personType = types[person.id] = Type({
      env: env,
      schema: person,
      base: base,
    });
    expect(personType).to.exist;
    expect(personType).to.have.property("id", "http://example.org/Person");
    expect(personType).to.have.property("schema");
    expect(personType).to.have.property("env", env);
    expect(personType).to.have.property("validate");
    expect(personType).to.have.property("context");
  });

  it("should create membership type", function () {
    var membershipType = types[membership.id] = Type({
      env: env,
      schema: membership,
      base: base,
    });
    expect(membershipType).to.exist;
    expect(membershipType).to.have.property("id", "http://example.org/Membership");
    expect(membershipType).to.have.property("schema");
    expect(membershipType).to.have.property("env", env);
    expect(membershipType).to.have.property("validate");
    expect(membershipType).to.have.property("context");
  });

  it("should create group type", function () {
    var groupType = types[group.id] = Type({
      env: env,
      schema: group,
      base: base,
    });
    expect(groupType).to.exist;
    expect(groupType).to.have.property("id", "http://example.org/Group");
    expect(groupType).to.have.property("schema");
    expect(groupType).to.have.property("env", env);
    expect(groupType).to.have.property("validate");
    expect(groupType).to.have.property("context");
  });

  describe(".context", function () {
    it("of personType should be correct", function () {
      expect(types[person.id].context())
      .to.deep.equal({
        "@vocab": "http://schema.org/",
        foaf: "http://xmlns.com/foaf/0.1/",
        org: "http://www.w3.org/TR/vocab-org#",
        name: "foaf:name",
        memberships: "org:hasMembership",
        Membership: "org:Membership",
        member: "org:member",
        Group: "org:Organization",
      });
    });
  });

  describe("Type.isType()", function () {
    it("of personType should be true", function () {
      expect(Type.isType(types[person.id])).to.be.true;
    });
  });

  describe("relations", function () {
    it("of personType should be { 'memberships': {} }", function () {
      expect(types[person.id].relations)
      .to.deep.equal(schemaPrefixUri(base, {
        memberships: person.properties.memberships,
      }));
    });

    it("of membershipType should be { 'member': {} }", function () {
      expect(types[membership.id].relations)
      .to.deep.equal(schemaPrefixUri(base, {
        member: membership.properties.member,
      }));
    });
  });
});
