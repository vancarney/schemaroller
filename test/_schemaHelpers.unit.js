import {should, expect} from "chai";
import {Schema, SchemaHelpers, ValidatorBuilder} from "./src/_schemaHelpers.js";
should();
"use strict";
/*
describe.only( "SchemaHelpers Unit Test Suite", ()=> {
  var helpers;
  let _schema = new Schema({
    myKey: {
      type: "String",
      restrict: "^[a-z0-9]$"
    }
  });

  describe( "Class Instantiation", ()=> {
    it( "should throw error if schema is not passed to constructor", function() {
      expect( function() { helpers = new SchemaHelpers(); } ).to.throw(
        "arguments[0] must be type 'Schema'");
    });
    it( "should successfully instantiate with schema", function() {
      expect( function() { helpers = new SchemaHelpers( _schema ); } ).to.not.throw(
        "arguments[0] must be type 'Schema'");
    });
  });

  describe( "ensureKindIsString", ()=> {
    it( "should accept strings", function() {
      helpers.ensureKindIsString("foo").should.eq("foo");
    });
    it( "should reject numbers", function() {
      helpers.ensureKindIsString(1).should.eq(false);
    });
    it( "should reject booleans", function() {
      helpers.ensureKindIsString(true).should.eq(false);
    });
    it( "should reject object", function() {
      helpers.ensureKindIsString({key:"foo"}).should.eq(false);

    });
    it( "should accept objects with type value", function() {
      helpers.ensureKindIsString({type:'String'}).should.eq("String");
    });

  });

  describe( "hasRequiredFields", ()=> {
    let _schema = new Schema({
      elements: {
        myElem: {
          type: "String",
          restrict: "^[a-z0-9]$",
          required: true
        }
      }
    });
    let helpers = new SchemaHelpers( _schema );
    it( "should fail if required fields not present", function() {
      helpers.ensureRequiredFields({}).should.eq(
        "required property 'myElem' is missing for 'root element'")
    });
    it( "should accept objects with required fields", function() {
      (typeof helpers.ensureRequiredFields({myElem:"Foo"})).should.eq("object");
    });
  });

  describe.only("walkSchema", ()=> {
    it("should walk a polymorphic schema", ()=> {
      let _s = {
        polymorphic: [
          {
            type: "Object",
            elements: {
              "*": {
                type: "*",
              },
            },
          },
          {
            type: "String",
          }],
      };
      let _ = SchemaHelpers.walkSchema( _s, "test" );
      // _.should.not.be.a.string;
      console.log(ValidatorBuilder.getInstance().list());
    });
  });

  //	describe.only( "createSchemaChild", ()=> {
  //		it( "should accept strings", function() {
  //			helpers.createSchemaChild("foo").should.eq("foo");
  //		});
  //	});
});
*/