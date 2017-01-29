/* eslint-disable */

_global.wf = {
  wfUtils: {
    Fun: {},
    Obj: {},
    Str: {},
    exists: val=> {
      return ((typeof val !== "undefined") && val !== null);
    },
  },
};

_global.wf.wfUtils.Fun.getFunctionName = fun => {
  let n;
  if ((n = fun.toString().match(/function+\s{1,}([a-zA-Z_0-9\$]*)/)) != null) {
    return n[1];
  } else {
    return null;
  }
};

_global.wf.wfUtils.Fun.getConstructorName = function(fun) {
  let name, ref;
  if (fun.constructor.name === "Function") {
    fun = (ref = fun()) != null ? ref : new fun;
  }
  if ((name = this.getFunctionName(fun.constructor)) != null) {
    return name;
  } else {
    return null;
  }
};

/**
 *
 * @param constructor
 * @param args
 * @returns {*}
 */
_global.wf.wfUtils.Fun.construct = (constructor, args) => {
  return new ((constructor.bind(...[null].concat(args))));
};

/**
 *
 * @type {()}
 */
_global.wf.wfUtils.Fun.factory = _global.wf.wfUtils.Fun.construct.bind(null, Function);

/**
 *
 * @param string
 * @returns {*}
 */
_global.wf.wfUtils.Fun.fromString = function(string) {
  let m;
  let _rx = /^function+\s\(([a-zA-Z0-9_\s,]*)\)+\s?\{+(.*)\}+$/;
  if ((m = string.replace(/\n/g, "").replace(/[\s]{2,}/g, "").match(_rx)) != null) {
    return _global.wf.wfUtils.Fun.factory([].concat(m[1], m[2]));
  } else {
    let _rx = `^Native::(${(Object.keys(this.natives)).join("|")})+$`;
    if ((m = string.match(new RegExp(_rx))) != null) {
      return this.natives[m[1]];
    } else {
      return null;
    }
  }
};
/**
 *
 * @param fun
 * @returns {*}
 */
_global.wf.wfUtils.Fun.toString = function(fun) {
  let s;
  if (typeof fun !== "function") {
    return fun;
  }
  if (((s = fun.toString()).match(/.*\[native code\].*/)) != null) {
    return `Native::${this.getFunctionName(fun)}`;
  } else {
    return s;
  }
};

_global.wf.wfUtils.Fun.natives = {
  Array,
  ArrayBuffer,
  Boolean,
  Buffer: ArrayBuffer,
  Date,
  Number,
  Object,
  String,
  Function,
};
/**
 *
 * @param obj
 */
_global.wf.wfUtils.Obj.getTypeOf = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};
/**
 *
 * @param value
 * @param kind
 * @returns {boolean}
 */
_global.wf.wfUtils.Obj.isOfType = function(value, kind) {
  let _fname = _global.wf.wfUtils.Fun.getFunctionName(kind);
  return (this.getTypeOf(value) === (_fname || value instanceof kind));
};
/**
 *
 * @param object
 * @returns {string}
 */
_global.wf.wfUtils.Obj.objectToQuery = function(object) {
  let i, j, keys, pairs, ref;
  if (object == null) {
    object = {};
  }
  pairs = [];
  keys = Object.keys(object);
  for (i = j = 0, ref = keys.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    pairs[i] = [keys[i], object[keys[i]]];
  }
  return (pairs.map(((_this => (v, k) => v.join("=")))(this))).join("&");
};
/**
 *
 * @param string
 * @returns {{}|*}
 */
_global.wf.wfUtils.Obj.queryToObject = function(string) {
  let o;
  o = {};
  decodeURIComponent(string).replace("?", "").split("&").forEach(((_this => (v, k) => {
    let p;
    if ((p = v.split("=")).length === 2) {
      return o[p[0]] = p[1];
    }
  }))(this));
  return o;
};
/**
 *
 * @param string
 * @returns {*}
 */
_global.wf.wfUtils.Str.capitalize = string => {
  if (string == null) {
    return "";
  }
  if (typeof string != "string")
    string = string.toString();
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};
/**
 *
 * @param string
 * @returns {*}
 */
_global.wf.wfUtils.Str.stripNull = string => {
  if (typeof string === "undefined") {
    return "";
  }
  return string.replace(/\0/g, "");
};
/**
 *
 * @param string
 * @returns {*}
 */
_global.wf.wfUtils.Str.regsafe = string => {
  if (typeof string === "undefined") {
    return "";
  }
  return string.replace(/(\.|\!|\{|\}|\(|\)|\-|\$|\!|\*|\?\[|\])+/g, "\\$&");
};
