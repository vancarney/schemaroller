const Validator = {};
/**
 * @private
 */
class BaseValidator {
  /**
   *
   * @constructor
   * @param path
   * @param signature
   */
  constructor(path, signature) {
    this.path = path;
    this.signature = signature;
  }

  /**
   *
   * @param path
   * @param value
   * @returns {*}
   */
  call(path, value) {
    let _ = ValidatorBuilder.getValidators()[path];
    if (_exists(_) && typeof _ === "function") {
      return _(value);
    }
    return `'${path}' has no validator defined`;
  }

  /**
   *
   * @param type
   * @param value
   * @returns {*}
   */
  checkType(type, value) {
    let _eval = (type, value)=> {
      let _x = (typeof type !== "string") ?
        _schemaroller_.getClass([type]) :
        type;
      let _rx = new RegExp(`^(${typeof value})+$`, "i");
      if (type === "array") {
        if (!Array.isArray((value))) {
          return `'${this.path}' expected ${type}, type was '<${typeof value}>'`;
        }
        return true;
      }

      if (_x.match(_rx) === null) {
        return `'${this.path}' expected ${type}, type was '<${typeof value}>'`;
      }
      return true;
    };
    if (_exists(type)) {
      if (Array.isArray(type)) {
        var _ = null;
        let k;
        for (k in type) {
          if (typeof (_ = _eval(type[k], value)) === "boolean") {
            return true;
          }
        }
        return _;
      }
      return _eval(type, value);
    } else {
      return `type for ${this.path} was undefined`;
    }
    return true;
  }

  /**
   *
   * @param value
   * @returns {string}
   */
  exec(value) {
    return `${wf.utils.Fun.getClassName(this)} requires override of 'exec'`;
  }
};

Validator.Array = class Arr extends BaseValidator {
  exec(value) {
    // let _iterate = (key, _val)=>{
    //   let _p = `${this.path}.${key}`;
    //   let _v = ValidatorBuilder.getValidators();
    //   if (!_v.hasOwnProperty(_p)) {
    //     let _el = this.signature.elements[key] ||
    //       this.signature.elements["*"];
    //     ValidatorBuilder.create(_el, _p);
    //   }
    //   let _ = this.call(_p, _val);
    //   if (typeof _ === "string") {
    //     return _;
    //   }
    // };
    let _ = this.checkType("array", value);
    if (typeof _ !== "boolean") {
      return _;
    }
    return true;
  }
};

/**
 * @private
 */
Validator.Object = class Obj extends BaseValidator {
  exec(value) {
    console.log(`exec ${this.path}`);
    let _iterate = (key, _val)=>{
      let _p = `${this.path}.${key}`;
      let _v = ValidatorBuilder.getValidators();
      if (!_v.hasOwnProperty(_p)) {
        let _el = this.signature.elements[key] ||
          this.signature.elements["*"];
        ValidatorBuilder.create(_el, _p);
      }
      let _ = this.call(_p, _val);
      if (typeof _ === "string") {
        return _;
      }
    };
    if (typeof value === "object") {
      if (!Array.isArray(value)) {
        for (let _k in value) {
          let _res = _iterate(_k, value[_k]);
          if (typeof _res === "string") {
            return _res;
          }
        }
      } else {
        for (let _ in value) {
          console.log(`exec ${this.path}`);
          let e = this.call(this.path, value[_]);
          if (typeof e === "string") {
            return e;
          }
        }
      }
      return true;
    } else {
      return `${this.path} expected value of type 'Object'. Type was '<${typeof value}>'`;
    }
    // should never hit this
    return `${this.path} was unable to be processed`;
  }
};

/**
 * @private
 */
Validator.Boolean = class Bool extends BaseValidator {
  exec(value) {
    return this.checkType("boolean", value);
  }
};

/**
 * @private
 */
Validator.String = class Str extends BaseValidator {
  exec(value) {
    let _ = this.checkType("string", value);

    if (_exists(this.signature.restrict)) {
      if (!_exists(new RegExp(this.signature.restrict).exec(value))) {
        return `value '${value}' for ${this.path} did not match required expression`;
      }
    }

    if ((typeof _).match(/^(boolean|string)+$/) !== null) {
      return _;
    }

    return true;
  }
};
/**
 * @private
 */
Validator.Number = class Num extends BaseValidator {
  exec(value) {
    let _ = this.checkType("number", value);
    if (typeof _ === "string") {
      return _;
    }
    // attempts to cast to number
    return !isNaN(new Number(value)) ?
			true :
			`${this.path} was unable to process '${value}' as Number`;
  }
};

/**
 * @private
 */
Validator.Function = class Fun extends BaseValidator {
  exec(value) {
    let _x = typeof this.signature.type === "string" ?
			this.signature.type :
			_global.wf.wfUtils.Fun.getConstructorName(this.signature.type);
    let _fn = _global.wf.wfUtils.Fun.getConstructorName(value);
    return _x === _fn ? true : `${this.path} requires '$_x' got '<${_fn}>' instead`;
  }
};

/**
 * @private
 */
Validator.Default = class Def extends BaseValidator {
  exec(value) {
    let _testValidator = (type, value) => {
      let _val = Validator[_global.wf.wfUtils.Str.capitalize(type)];
      if (!_exists(_val)) {
        return `'${this.path}' was unable to obtain validator for type '<${type}>'`;
      }
      let _ = new _val(this.path, this.signature);
      return _.exec(value);
    };
    var _x = typeof this.signature.type === "string" ?
			_schemaroller_.getClass(this.signature.type) :
			this.signature.type;
    if (_x === "*") {
      return true;
    }
    let _tR = this.checkType(_x, value);
    if (typeof _tR === "string") {
      return _tR;
    }
    if (Array.isArray(_x)) {
      let _ = _x.map(itm=> {
        let _clazz = _schemaroller_.getClass(itm);
        return _testValidator(_clazz, value);
      });
      return (0 <= _.indexOf(true)) ? true : _[_.length - 1];
    }
    return _testValidator(_x, value);
  }
};
