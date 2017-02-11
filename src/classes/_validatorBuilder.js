/**
 * @private
 */
let __vBuilder = null;
/**
 * @private
 */
class ValidatorBuilder {
  /**
   * @constructor
   */
  constructor() {
    if (!_exists(__vBuilder)) {
      _validators.set((__vBuilder = this), {});
    }
    return __vBuilder;
  }
  /**
   * @returns list of validation paths
   */
  list() {
    let _v = _validators.get(this);
    return Object.keys(_v);
  }
  /**
   * @param path
   * @returns item at path reference
   */
  get(path) {
    let _v = _validators.get(this);
    return _exists(_v[path]) ? _v[path] : null;
  }
  /**
   * @param _path
   * @param func
   */
  set(_path, func) {
    if (!_exists(func) || typeof func !== "function") {
      return "2nd argument expects a function";
    }
    _validators.get(this)[_path] = func;
    return this;
  }

  /**
   *
   * @param ref
   * @param path
   * @returns {function(*=)}
   */
  create(ref, path) {
    if (!_exists(ref)) {
      throw "create requires object reference at arguments[0]";
    }

    let _signatures = ref.hasOwnProperty("polymorphic") ?
      ref.polymorphic :
      (Array.isArray(ref) ? ref : [ref]);

    _validators.get(this)[path] = {};

    let _functs = _signatures.map(_sig=> {
      let _typeof	= _global.wf.wfUtils.Str.capitalize(_sig.type);
      let _hasKey	= (0 <= Object.keys(Validator).indexOf(_typeof));
      return new Validator[_hasKey ? _typeof : "Default"](path, _sig);
    });

    return _validators.get(this)[path] = value=> {
      var _result;
      for (let idx in _functs) {
        _result = _functs[idx].exec(value);
        if (typeof _result === "boolean") {
          return _result;
        }
      }
      return _result;
    };
  }

  /**
   * executes validator `value` with validator at `path`
   * @param path
   * @param value
   */
  exec(path, value) {
    let _v = _validators.get(this);
    if (!_v.hasOwnProperty(path)) {
      return `validator for '${path}' does not exist`;
    }
    return _v[path](value);
  }

  /**
   * singleton instantiator
   * @returns {ValidatorBuilder}
   */
  static getInstance() {
    return new this;
  }

  /**
   * @returns validators WeakMap
   */
  static getValidators() {
    return _validators.get(ValidatorBuilder.getInstance());
  }

  /**
   *
   * @param signature
   * @param path
   */
  static create(signature, path) {
    ValidatorBuilder.getInstance().create(signature, path);
  }
}
