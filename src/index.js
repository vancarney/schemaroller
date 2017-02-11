//
// SchemaRoller
// (c)2015-2016 Van Carney <carney.van@gmail.com>
//

// references the global scope of our environment
const _global = (typeof exports !== "undefined") && (exports !== null) ?
  exports :
  window;
/**
 * @private
 */
_global.SchemaRoller = ()=> {
  const _object				= new WeakMap();
  const _mdRef				= new WeakMap();
  const _requiredElements	= new WeakMap();
  const _validators			= new WeakMap();
  const _singletons			= new WeakMap();
  const _vectorTypes		= new WeakMap();
  const _schemaOptions		= new WeakMap();
  const _schemaHelpers		= new WeakMap();
  const _schemaSignatures	= new WeakMap();
  // injects base classes
  //-- inject:./classes/_schemaValidator.js
  //-- inject:./classes/_validators.js
  //-- inject:./classes/_validatorBuilder.js
  //-- inject:./classes/Vector.js
  //-- inject:./classes/_schemaHelpers.js
  //-- inject:./classes/Schema.js
  //-- inject:./classes/_metaData.js
  let _schemaroller_ = new SchemaRoller;
  _schemaroller_.registerClass("Schema", _schemaroller_.Schema = Schema);
  _schemaroller_.registerClass("Vector", _schemaroller_.Vector = Vector);
  let _sKeys = Object.keys(_schemaroller_.schemaRef);
  if (_schemaroller_.rx === null) {
    let _rx = `^((${_sKeys.join("|")})+,?){${_sKeys.length}}$`;
	  _schemaroller_.rx = new RegExp(_rx);
  }
  return _schemaroller_;
};

// polyfills Object.assign
if (typeof Object.assign != "function") {
  Object.assign = function(target) {
    if (target == null) {
    	throw new TypeError("Cannot convert undefined or null to object");
    }
    target = Object(target);
    let index  = 1;
    while (index < arguments.length) {
      let source = arguments[index];
      if (source !== null) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      index = index + 1;
    }
    return target;
  };
}
//-- inject:./wfUtils.js
let _exists = _global.wf.wfUtils.exists;
// holds references to registered JS Objects
let _kinds = new WeakMap() || {};
//-- inject:./classes/SchemaRoller.js
//-- inject:../include/index.js
