/**
 * @class Schema
 */
class Schema {
  /**
   * @constructor
   * @param {Object} _o - schema definition object
   * @param {Object} opts - schema options
   */
  constructor(_signature, opts = {extensible: false}) {
    var eMsg;
    if (!_exists(_signature)) {
      return `Schema requires JSON object at arguments[0]. Got '${typeof _signature}'`;
    }
    _object.set(this, {});
    _schemaOptions.set(this, opts);
    _validators.set(this, {});
    _requiredElements.set(this, []);
    if (_exists(_signature.polymorphic)) {
      _signature = _signature.polymorphic;
    }
    // traverses elements of schema checking for elements marked as reqiured
    if (_exists(_signature.elements)) {
      _signature = _signature.elements;
    }

    for (let _sigEl of Object.keys(_signature)) {
      // tests for element `required`
      let _req = _signature[_sigEl].required;
      if (_req) {
        // adds required element to list
        _requiredElements.get(this).push(_sigEl);
      }
    }
    // tests for metadata
    if (!(this instanceof _metaData)) {
      let _;
      if (!_exists(arguments[2])) {
        _ = new _metaData(this, {
          _path: "",
          _root: this,
        });
      } else {
        _ = (arguments[2] instanceof _metaData) ?
          arguments[2] :
          new _metaData(this, arguments[2]);
      }
      _mdRef.set(this, _);
    }
    // attempts to validate provided `schema` entries
    let _schemaValidator = new SchemaValidator(_signature, this.options);
    // throws error if error messagereturned
    eMsg = _schemaValidator.isValid();
    if (typeof (eMsg) === "string") {
      throw eMsg;
    }
    _schemaSignatures.set(this, _signature);
    _schemaHelpers.set(this, new SchemaHelpers(this));
    _schemaHelpers.get(this).walkSchema(_signature || {}, this.path);
  }
  /**
   * @returns schema signature object
   */
  get signature() {
    return _schemaSignatures.get(this);
  }
  /**
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    let _ = _object.get(this);
    return _.hasOwnProperty(key) ? _[key] : null;
  }
  /**
   * sets value to schema key
   * @param {string|object} key
   * @param {any} value
   */
  set(key, value) {
    let _sH = _schemaHelpers.get(this);
    if (typeof key === "object") {
      return _sH.setObject(key);
    }
    let _childSigs  = this.signature.elements || this.signature;
    let _pathKeys = key.split(".");
    for (let _ in _pathKeys) {
      let k = _pathKeys[_];
      let _schema;
      let _key = this.path.length > 0 ? `${this.path}.${k}` : k;
      if (_exists(_childSigs[k])) {
        _schema = _childSigs[k];
      } else {
        // attempts to find wildcard element name
        if (_exists(_childSigs["*"])) {
          // applies schema
          _schema = _childSigs["*"].polymorphic || _childSigs["*"];
          // derives path for wildcard element
          let _pKey = this.path.length > 1 ? `${this.path}.${key}` : key;
          // creates Validator for path
          ValidatorBuilder.getInstance().create(_schema, _pKey);
        }
      }
      // handles missing schema signatures
      if (!_exists(_schema)) {
        // rejects non-members of non-extensible schemas
        if (!this.isExtensible) {
          return `element '${_key}' is not a valid element`;
        }
        _schema = Schema.defaultSignature;
      }
      // hanldes child objects
      if (typeof value === "object") {
        value = _sH.setChildObject(_key, value);
      } else {
        // handles absolute vaues (strings, numbers, booleans...)
        let eMsg = _sH.validate(_key, value);
        if (typeof eMsg === "string") {
          return eMsg;
        }
      }
      // applies value to schema
      let _o = _object.get(this);
      _o[key] = value;
      _object.set(this, _o);
    }
    // returns self for chaining
    return this;
  }
  /**
   * @returns {Boolean(true)|string} returns error string or true
   */
  validate() {
    var _path = this.path;
    // return true
    for (let _k of ValidatorBuilder.getInstance().list()) {
      let e;
      _path = _path.length > 0 ? `${_path}.${_k}` : _k;
      if (typeof (e = _validate(_k, this.root.get(_k))) === "string") {
        return e;
      }
    }
    return true;
  }

  /**
	 * @returns {*|{}}
   */
  valueOf() {
    return _object.get(this);
  }

  /**
	 *
   * @returns {{}}
   */
  toJSON() {
    let _o = {};
    let _derive = function(itm) {
      if (itm instanceof Schema) {
        return _derive(itm.toJSON());
      }
      if (itm instanceof Vector) {
        let _arr = [];
        for (let k of itm.valueOf()) {
          _arr.push(_derive(itm[k]));
          return _arr;
        }
      }
      return itm;
    };
    let _obj = _object.get(this);
    for (let k in _obj) {
      _o[k] = _derive(_obj[k]);
    }
    return _o;
  }

  /**
	 *
   * @param pretty
	 * @returns {string}
   */
  toString(pretty = false) {
    return JSON.stringify(this.toJSON(), null, (pretty ? 2 : void(0)));
  }

  /**
	 *
	 * @returns {{}}
   */
  get options() {
    return _schemaOptions.get(this);
  }

  /**
   * @returns {string} Object ID for Schema
   */
  get objectID() {
    return _mdRef.get(this)._id;
  }

  /**
	 *
   * @returns {Schema} elemetn at Schema root
   */
  get root() {
    let _ = _mdRef.get(this).root;
    return _exists(_) ? _ : this;
  }

  /**
	 *
   * @returns {string} path to current Schema
   */
  get path() {
    let _ = _mdRef.get(this).path;
    return _exists(_) ? _ :  "";
  }

  /**
	 *
   * @returns {Schema} parent Schema element
   */
  get parent() {
    let _ = _mdRef.get(this).root;
    return _exists(_) ? _ : this;
  }

  /**
	 *
   * @returns {[string]} list of required elements on this Schema
   */
  get requiredFields() {
    return _requiredElements.get(this);
  }

  /**
   * indicates if Schema will accept arbitrary keys
   * @returns {boolean}
   */
  get isExtensible() {
//		return this.options.extensible;
    return _exists(this.signature.extensible) ?
			this.signature.extensible :
			(this.options.extensible || false);
  }

  /**
	 *
   * @returns {JSD}
   */
  static defaultSignature() {
    return {
      type: "*",
      required: true,
      extensible: false,
    };
  }
};
