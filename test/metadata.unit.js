import { should, expect } from "chai";
import {Schema, Vector, _metaData} from "./src/_metaData.js";
should();

describe( "MetaData Unit Test Suite", ()=> {
	var _md = null;
	let _sublassErr = "new _metaData() requires Schema or Vector. Was '<Object>'";
	describe( "SubClass Validation", ()=> {
		it( "should not accept objects that are not subclasses of Schema or Vector", function() {
			expect(()=> _md = new _metaData({}, {})).to.throw(_sublassErr);
		});
		it( "should accept objects that are subclasses of Schema", function() {
			let _ = new Schema({extensible: true});
			expect(()=> _md =new _metaData( _, { _path: "", _root: _})).to.not.throw(_sublassErr);
		});
		it( "should accept objects that are subclasses of Vector", function() {
			let _ = new Vector();
			expect(()=> _md = new _metaData( _, { _path: "", _root: _})).to.not.throw(_sublassErr);
		});
	});
	describe( "Parameter Accessor Validation", ()=> {
		let _ = new Schema({});
		let _md = new _metaData( _, { _path: "key", _root: _})
		it('should access `root` property', function() {
			(_md.root === _).should.be.true;
		});
		it('should access `path` property', function() {
			_md.path.should.eq("key");
		});
		it('should access `parent` property', function() {
			let _md = new _metaData( _, { _path: "", _root: _})
			_md.parent.should.eq(_);
		});
	});
});
  