(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cql = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	Array.prototype.flat||Object.defineProperty(Array.prototype,"flat",{configurable:!0,value:function r(){var t=isNaN(arguments[0])?1:Number(arguments[0]);return t?Array.prototype.reduce.call(this,function(a,e){return Array.isArray(e)?a.push.apply(a,r.call(e,t-1)):a.push(e),a},[]):Array.prototype.slice.call(this)},writable:!0}),Array.prototype.flatMap||Object.defineProperty(Array.prototype,"flatMap",{configurable:!0,value:function(r){return Array.prototype.map.apply(this,arguments).flat()},writable:!0});

	var clone_1 = createCommonjsModule(function (module) {
	var clone = (function() {

	function _instanceof(obj, type) {
	  return type != null && obj instanceof type;
	}

	var nativeMap;
	try {
	  nativeMap = Map;
	} catch(_) {
	  // maybe a reference error because no `Map`. Give it a dummy value that no
	  // value will ever be an instanceof.
	  nativeMap = function() {};
	}

	var nativeSet;
	try {
	  nativeSet = Set;
	} catch(_) {
	  nativeSet = function() {};
	}

	var nativePromise;
	try {
	  nativePromise = Promise;
	} catch(_) {
	  nativePromise = function() {};
	}

	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
	 *    should be cloned as well. Non-enumerable properties on the prototype
	 *    chain will be ignored. (optional - false by default)
	*/
	function clone(parent, circular, depth, prototype, includeNonEnumerable) {
	  if (typeof circular === 'object') {
	    depth = circular.depth;
	    prototype = circular.prototype;
	    includeNonEnumerable = circular.includeNonEnumerable;
	    circular = circular.circular;
	  }
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];

	  var useBuffer = typeof Buffer != 'undefined';

	  if (typeof circular == 'undefined')
	    circular = true;

	  if (typeof depth == 'undefined')
	    depth = Infinity;

	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;

	    if (depth === 0)
	      return parent;

	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }

	    if (_instanceof(parent, nativeMap)) {
	      child = new nativeMap();
	    } else if (_instanceof(parent, nativeSet)) {
	      child = new nativeSet();
	    } else if (_instanceof(parent, nativePromise)) {
	      child = new nativePromise(function (resolve, reject) {
	        parent.then(function(value) {
	          resolve(_clone(value, depth - 1));
	        }, function(err) {
	          reject(_clone(err, depth - 1));
	        });
	      });
	    } else if (clone.__isArray(parent)) {
	      child = [];
	    } else if (clone.__isRegExp(parent)) {
	      child = new RegExp(parent.source, __getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (clone.__isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      if (Buffer.allocUnsafe) {
	        // Node.js >= 4.5.0
	        child = Buffer.allocUnsafe(parent.length);
	      } else {
	        // Older Node.js versions
	        child = new Buffer(parent.length);
	      }
	      parent.copy(child);
	      return child;
	    } else if (_instanceof(parent, Error)) {
	      child = Object.create(parent);
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }

	    if (circular) {
	      var index = allParents.indexOf(parent);

	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }

	    if (_instanceof(parent, nativeMap)) {
	      parent.forEach(function(value, key) {
	        var keyChild = _clone(key, depth - 1);
	        var valueChild = _clone(value, depth - 1);
	        child.set(keyChild, valueChild);
	      });
	    }
	    if (_instanceof(parent, nativeSet)) {
	      parent.forEach(function(value) {
	        var entryChild = _clone(value, depth - 1);
	        child.add(entryChild);
	      });
	    }

	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }

	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }

	    if (Object.getOwnPropertySymbols) {
	      var symbols = Object.getOwnPropertySymbols(parent);
	      for (var i = 0; i < symbols.length; i++) {
	        // Don't need to worry about cloning a symbol because it is a primitive,
	        // like a number or string.
	        var symbol = symbols[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
	        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
	          continue;
	        }
	        child[symbol] = _clone(parent[symbol], depth - 1);
	        if (!descriptor.enumerable) {
	          Object.defineProperty(child, symbol, {
	            enumerable: false
	          });
	        }
	      }
	    }

	    if (includeNonEnumerable) {
	      var allPropertyNames = Object.getOwnPropertyNames(parent);
	      for (var i = 0; i < allPropertyNames.length; i++) {
	        var propertyName = allPropertyNames[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
	        if (descriptor && descriptor.enumerable) {
	          continue;
	        }
	        child[propertyName] = _clone(parent[propertyName], depth - 1);
	        Object.defineProperty(child, propertyName, {
	          enumerable: false
	        });
	      }
	    }

	    return child;
	  }

	  return _clone(parent, depth);
	}

	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function clonePrototype(parent) {
	  if (parent === null)
	    return null;

	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};

	// private utility functions

	function __objToStr(o) {
	  return Object.prototype.toString.call(o);
	}
	clone.__objToStr = __objToStr;

	function __isDate(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Date]';
	}
	clone.__isDate = __isDate;

	function __isArray(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Array]';
	}
	clone.__isArray = __isArray;

	function __isRegExp(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	}
	clone.__isRegExp = __isRegExp;

	function __getRegExpFlags(re) {
	  var flags = '';
	  if (re.global) flags += 'g';
	  if (re.ignoreCase) flags += 'i';
	  if (re.multiline) flags += 'm';
	  return flags;
	}
	clone.__getRegExpFlags = __getRegExpFlags;

	return clone;
	})();

	if ( module.exports) {
	  module.exports = clone;
	}
	});

	var fastJsonStableStringify = function (data, opts) {
	    if (!opts) opts = {};
	    if (typeof opts === 'function') opts = { cmp: opts };
	    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

	    var cmp = opts.cmp && (function (f) {
	        return function (node) {
	            return function (a, b) {
	                var aobj = { key: a, value: node[a] };
	                var bobj = { key: b, value: node[b] };
	                return f(aobj, bobj);
	            };
	        };
	    })(opts.cmp);

	    var seen = [];
	    return (function stringify (node) {
	        if (node && node.toJSON && typeof node.toJSON === 'function') {
	            node = node.toJSON();
	        }

	        if (node === undefined) return;
	        if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
	        if (typeof node !== 'object') return JSON.stringify(node);

	        var i, out;
	        if (Array.isArray(node)) {
	            out = '[';
	            for (i = 0; i < node.length; i++) {
	                if (i) out += ',';
	                out += stringify(node[i]) || 'null';
	            }
	            return out + ']';
	        }

	        if (node === null) return 'null';

	        if (seen.indexOf(node) !== -1) {
	            if (cycles) return JSON.stringify('__cycle__');
	            throw new TypeError('Converting circular structure to JSON');
	        }

	        var seenIndex = seen.push(node) - 1;
	        var keys = Object.keys(node).sort(cmp && cmp(node));
	        out = '';
	        for (i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            var value = stringify(node[key]);

	            if (!value) continue;
	            if (out) out += ',';
	            out += JSON.stringify(key) + ':' + value;
	        }
	        seen.splice(seenIndex, 1);
	        return '{' + out + '}';
	    })(data);
	};

	function accessor (fn, fields, name) {
	  fn.fields = fields || [];
	  fn.fname = name;
	  return fn;
	}

	function getter (path) {
	  return path.length === 1 ? get1(path[0]) : getN(path);
	}

	const get1 = field => function (obj) {
	  return obj[field];
	};

	const getN = path => {
	  const len = path.length;
	  return function (obj) {
	    for (let i = 0; i < len; ++i) {
	      obj = obj[path[i]];
	    }

	    return obj;
	  };
	};

	function error (message) {
	  throw Error(message);
	}

	function splitAccessPath (p) {
	  const path = [],
	        n = p.length;
	  let q = null,
	      b = 0,
	      s = '',
	      i,
	      j,
	      c;
	  p = p + '';

	  function push() {
	    path.push(s + p.substring(i, j));
	    s = '';
	    i = j + 1;
	  }

	  for (i = j = 0; j < n; ++j) {
	    c = p[j];

	    if (c === '\\') {
	      s += p.substring(i, j);
	      s += p.substring(++j, ++j);
	      i = j;
	    } else if (c === q) {
	      push();
	      q = null;
	      b = -1;
	    } else if (q) {
	      continue;
	    } else if (i === b && c === '"') {
	      i = j + 1;
	      q = c;
	    } else if (i === b && c === "'") {
	      i = j + 1;
	      q = c;
	    } else if (c === '.' && !b) {
	      if (j > i) {
	        push();
	      } else {
	        i = j + 1;
	      }
	    } else if (c === '[') {
	      if (j > i) push();
	      b = i = j + 1;
	    } else if (c === ']') {
	      if (!b) error('Access path missing open bracket: ' + p);
	      if (b > 0) push();
	      b = 0;
	      i = j + 1;
	    }
	  }

	  if (b) error('Access path missing closing bracket: ' + p);
	  if (q) error('Access path missing closing quote: ' + p);

	  if (j > i) {
	    j++;
	    push();
	  }

	  return path;
	}

	function field (field, name, opt) {
	  const path = splitAccessPath(field);
	  field = path.length === 1 ? path[0] : field;
	  return accessor((opt && opt.get || getter)(path), [field], name || field);
	}

	const id = field('id');
	const identity = accessor(_ => _, [], 'identity');
	const zero = accessor(() => 0, [], 'zero');
	const one = accessor(() => 1, [], 'one');
	const truthy = accessor(() => true, [], 'true');
	const falsy = accessor(() => false, [], 'false');

	function log(method, level, input) {
	  const args = [level].concat([].slice.call(input));
	  console[method].apply(console, args); // eslint-disable-line no-console
	}

	const None = 0;
	const Error$1 = 1;
	const Warn = 2;
	const Info = 3;
	const Debug = 4;
	function logger (_, method) {
	  let level = _ || None;
	  return {
	    level(_) {
	      if (arguments.length) {
	        level = +_;
	        return this;
	      } else {
	        return level;
	      }
	    },

	    error() {
	      if (level >= Error$1) log(method || 'error', 'ERROR', arguments);
	      return this;
	    },

	    warn() {
	      if (level >= Warn) log(method || 'warn', 'WARN', arguments);
	      return this;
	    },

	    info() {
	      if (level >= Info) log(method || 'log', 'INFO', arguments);
	      return this;
	    },

	    debug() {
	      if (level >= Debug) log(method || 'log', 'DEBUG', arguments);
	      return this;
	    }

	  };
	}

	var isArray = Array.isArray;

	function isObject (_) {
	  return _ === Object(_);
	}

	function peek (array) {
	  return array[array.length - 1];
	}

	function array (_) {
	  return _ != null ? isArray(_) ? _ : [_] : [];
	}

	function isFunction (_) {
	  return typeof _ === 'function';
	}

	function constant (_) {
	  return isFunction(_) ? _ : () => _;
	}

	function extend (_) {
	  for (let x, k, i = 1, len = arguments.length; i < len; ++i) {
	    x = arguments[i];

	    for (k in x) {
	      _[k] = x[k];
	    }
	  }

	  return _;
	}

	const hop = Object.prototype.hasOwnProperty;
	function has (object, property) {
	  return hop.call(object, property);
	}

	function isBoolean (_) {
	  return typeof _ === 'boolean';
	}

	function isNumber (_) {
	  return typeof _ === 'number';
	}

	function isString (_) {
	  return typeof _ === 'string';
	}

	/**
	 * Return the numerical span of an array: the difference between
	 * the last and first values.
	 */

	function span (array) {
	  return array && peek(array) - array[0] || 0;
	}

	function $(x) {
	  return isArray(x) ? '[' + x.map($) + ']' : isObject(x) || isString(x) ? // Output valid JSON and JS source strings.
	  // See http://timelessrepo.com/json-isnt-a-javascript-subset
	  JSON.stringify(x).replace('\u2028', '\\u2028').replace('\u2029', '\\u2029') : x;
	}

	function toSet (_) {
	  const s = {},
	        n = _.length;

	  for (let i = 0; i < n; ++i) s[_[i]] = true;

	  return s;
	}

	const duplicate = clone_1;
	/**
	 * The opposite of _.pick; this method creates an object composed of the own
	 * and inherited enumerable string keyed properties of object that are not omitted.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	function omit(obj, props) {
	    const copy = Object.assign({}, obj);
	    for (const prop of props) {
	        delete copy[prop];
	    }
	    return copy;
	}
	/**
	 * Monkey patch Set so that `stringify` produces a string representation of sets.
	 */
	Set.prototype['toJSON'] = function () {
	    return `Set(${[...this].map(x => fastJsonStableStringify(x)).join(',')})`;
	};
	/**
	 * Converts any object to a string representation that can be consumed by humans.
	 */
	const stringify = fastJsonStableStringify;
	function contains(array, item) {
	    return array.indexOf(item) > -1;
	}
	/**
	 * Returns true if any item returns true.
	 */
	function some(arr, f) {
	    let i = 0;
	    for (const [k, a] of arr.entries()) {
	        if (f(a, k, i++)) {
	            return true;
	        }
	    }
	    return false;
	}
	// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
	const keys = Object.keys;
	const entries = Object.entries;
	/**
	 * Convert a string into a valid variable name
	 */
	function varName(s) {
	    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
	    const alphanumericS = s.replace(/\W/g, '_');
	    // Add _ if the string has leading numbers.
	    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
	}
	function titleCase(s) {
	    return s.charAt(0).toUpperCase() + s.substr(1);
	}
	/**
	 * Converts a path to an access path with datum.
	 * @param path The field name.
	 * @param datum The string to use for `datum`.
	 */
	function accessPathWithDatum(path, datum = 'datum') {
	    const pieces = splitAccessPath(path);
	    const prefixes = [];
	    for (let i = 1; i <= pieces.length; i++) {
	        const prefix = `[${pieces.slice(0, i).map($).join('][')}]`;
	        prefixes.push(`${datum}${prefix}`);
	    }
	    return prefixes.join(' && ');
	}
	/**
	 * Return access with datum to the flattened field.
	 *
	 * @param path The field name.
	 * @param datum The string to use for `datum`.
	 */
	function flatAccessWithDatum(path, datum = 'datum') {
	    return `${datum}[${$(splitAccessPath(path).join('.'))}]`;
	}
	function escapePathAccess(string) {
	    return string.replace(/(\[|\]|\.|'|")/g, '\\$1');
	}
	/**
	 * Replaces path accesses with access to non-nested field.
	 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
	 */
	function replacePathInField(path) {
	    return `${splitAccessPath(path).map(escapePathAccess).join('\\.')}`;
	}
	/**
	 * Remove path accesses with access from field.
	 * For example, `foo["bar"].baz` becomes `foo.bar.baz`.
	 */
	function removePathFromField(path) {
	    return `${splitAccessPath(path).join('.')}`;
	}
	/**
	 * This is a replacement for chained || for numeric properties or properties that respect null so that 0 will be included.
	 */
	function getFirstDefined(...args) {
	    for (const arg of args) {
	        if (arg !== undefined) {
	            return arg;
	        }
	    }
	    return undefined;
	}
	function internalField(name) {
	    return isInternalField(name) ? name : `__${name}`;
	}
	function isInternalField(name) {
	    return name.indexOf('__') === 0;
	}
	/**
	 * Returns whether the passed in value is a valid number.
	 */
	function isNumeric(value) {
	    if (isNumber(value)) {
	        return true;
	    }
	    return !isNaN(value) && !isNaN(parseFloat(value));
	}

	/*
	 * Constants and utilities for encoding channels (Visual variables)
	 * such as 'x', 'y', 'color'.
	 */
	var __rest = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	// Facet
	const ROW = 'row';
	const COLUMN = 'column';
	const FACET = 'facet';
	// Position
	const X = 'x';
	const Y = 'y';
	const X2 = 'x2';
	const Y2 = 'y2';
	// Arc-Position
	const RADIUS = 'radius';
	const RADIUS2 = 'radius2';
	const THETA = 'theta';
	const THETA2 = 'theta2';
	// Geo Position
	const LATITUDE = 'latitude';
	const LONGITUDE = 'longitude';
	const LATITUDE2 = 'latitude2';
	const LONGITUDE2 = 'longitude2';
	// Mark property with scale
	const COLOR = 'color';
	const FILL = 'fill';
	const STROKE = 'stroke';
	const SHAPE = 'shape';
	const SIZE = 'size';
	const ANGLE = 'angle';
	const OPACITY = 'opacity';
	const FILLOPACITY = 'fillOpacity';
	const STROKEOPACITY = 'strokeOpacity';
	const STROKEWIDTH = 'strokeWidth';
	const STROKEDASH = 'strokeDash';
	// Non-scale channel
	const TEXT = 'text';
	const ORDER = 'order';
	const DETAIL = 'detail';
	const KEY = 'key';
	const TOOLTIP = 'tooltip';
	const HREF = 'href';
	const URL = 'url';
	const DESCRIPTION = 'description';
	const POSITION_CHANNEL_INDEX = {
	    x: 1,
	    y: 1,
	    x2: 1,
	    y2: 1
	};
	const POLAR_POSITION_CHANNEL_INDEX = {
	    theta: 1,
	    theta2: 1,
	    radius: 1,
	    radius2: 1
	};
	function isPolarPositionChannel(c) {
	    return c in POLAR_POSITION_CHANNEL_INDEX;
	}
	const GEO_POSIITON_CHANNEL_INDEX = {
	    longitude: 1,
	    longitude2: 1,
	    latitude: 1,
	    latitude2: 1
	};
	function getPositionChannelFromLatLong(channel) {
	    switch (channel) {
	        case LATITUDE:
	            return 'y';
	        case LATITUDE2:
	            return 'y2';
	        case LONGITUDE:
	            return 'x';
	        case LONGITUDE2:
	            return 'x2';
	    }
	}
	function isGeoPositionChannel(c) {
	    return c in GEO_POSIITON_CHANNEL_INDEX;
	}
	const GEOPOSITION_CHANNELS = keys(GEO_POSIITON_CHANNEL_INDEX);
	const UNIT_CHANNEL_INDEX = Object.assign(Object.assign(Object.assign(Object.assign({}, POSITION_CHANNEL_INDEX), POLAR_POSITION_CHANNEL_INDEX), GEO_POSIITON_CHANNEL_INDEX), { 
	    // color
	    color: 1, fill: 1, stroke: 1, 
	    // other non-position with scale
	    opacity: 1, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, strokeDash: 1, size: 1, angle: 1, shape: 1, 
	    // channels without scales
	    order: 1, text: 1, detail: 1, key: 1, tooltip: 1, href: 1, url: 1, description: 1 });
	function isColorChannel(channel) {
	    return channel === COLOR || channel === FILL || channel === STROKE;
	}
	const FACET_CHANNEL_INDEX = {
	    row: 1,
	    column: 1,
	    facet: 1
	};
	const FACET_CHANNELS = keys(FACET_CHANNEL_INDEX);
	const CHANNEL_INDEX = Object.assign(Object.assign({}, UNIT_CHANNEL_INDEX), FACET_CHANNEL_INDEX);
	const CHANNELS = keys(CHANNEL_INDEX);
	const SINGLE_DEF_CHANNEL_INDEX = __rest(CHANNEL_INDEX, ["order", "detail", "tooltip"]);
	const SINGLE_DEF_UNIT_CHANNEL_INDEX = __rest(SINGLE_DEF_CHANNEL_INDEX, ["row", "column", "facet"]);
	/**
	 * Channels that cannot have an array of channelDef.
	 * model.fieldDef, getFieldDef only work for these channels.
	 *
	 * (The only two channels that can have an array of channelDefs are "detail" and "order".
	 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
	 * are not applicable for them. Similarly, selection projection won't work with "detail" and "order".)
	 */
	const SINGLE_DEF_CHANNELS = keys(SINGLE_DEF_CHANNEL_INDEX);
	const SINGLE_DEF_UNIT_CHANNELS = keys(SINGLE_DEF_UNIT_CHANNEL_INDEX);
	function isSingleDefUnitChannel(str) {
	    return !!SINGLE_DEF_UNIT_CHANNEL_INDEX[str];
	}
	function isChannel(str) {
	    return !!CHANNEL_INDEX[str];
	}
	const SECONDARY_RANGE_CHANNEL = [X2, Y2, LATITUDE2, LONGITUDE2, THETA2, RADIUS2];
	function isSecondaryRangeChannel(c) {
	    const main = getMainRangeChannel(c);
	    return main !== c;
	}
	/**
	 * Get the main channel for a range channel. E.g. `x` for `x2`.
	 */
	function getMainRangeChannel(channel) {
	    switch (channel) {
	        case X2:
	            return X;
	        case Y2:
	            return Y;
	        case LATITUDE2:
	            return LATITUDE;
	        case LONGITUDE2:
	            return LONGITUDE;
	        case THETA2:
	            return THETA;
	        case RADIUS2:
	            return RADIUS;
	    }
	    return channel;
	}
	function getVgPositionChannel(channel) {
	    if (isPolarPositionChannel(channel)) {
	        switch (channel) {
	            case THETA:
	                return 'startAngle';
	            case THETA2:
	                return 'endAngle';
	            case RADIUS:
	                return 'outerRadius';
	            case RADIUS2:
	                return 'innerRadius';
	        }
	    }
	    return channel;
	}
	/**
	 * Get the main channel for a range channel. E.g. `x` for `x2`.
	 */
	function getSecondaryRangeChannel(channel) {
	    switch (channel) {
	        case X:
	            return X2;
	        case Y:
	            return Y2;
	        case LATITUDE:
	            return LATITUDE2;
	        case LONGITUDE:
	            return LONGITUDE2;
	        case THETA:
	            return THETA2;
	        case RADIUS:
	            return RADIUS2;
	    }
	    return undefined;
	}
	function getSizeChannel(channel) {
	    switch (channel) {
	        case X:
	        case X2:
	            return 'width';
	        case Y:
	        case Y2:
	            return 'height';
	    }
	    return undefined;
	}
	/**
	 * Get the main channel for a range channel. E.g. `x` for `x2`.
	 */
	function getOffsetChannel(channel) {
	    switch (channel) {
	        case X:
	            return 'xOffset';
	        case Y:
	            return 'yOffset';
	        case X2:
	            return 'x2Offset';
	        case Y2:
	            return 'y2Offset';
	        case THETA:
	            return 'thetaOffset';
	        case RADIUS:
	            return 'radiusOffset';
	        case THETA2:
	            return 'theta2Offset';
	        case RADIUS2:
	            return 'radius2Offset';
	    }
	    return undefined;
	}
	// CHANNELS without COLUMN, ROW
	const UNIT_CHANNELS = keys(UNIT_CHANNEL_INDEX);
	// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
	const // The rest of unit channels then have scale
	NONPOSITION_CHANNEL_INDEX = __rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "latitude", "longitude", "latitude2", "longitude2", "theta", "theta2", "radius", "radius2"]);
	const NONPOSITION_CHANNELS = keys(NONPOSITION_CHANNEL_INDEX);
	const POSITION_SCALE_CHANNEL_INDEX = {
	    x: 1,
	    y: 1
	};
	const POSITION_SCALE_CHANNELS = keys(POSITION_SCALE_CHANNEL_INDEX);
	function isXorY(channel) {
	    return channel in POSITION_SCALE_CHANNEL_INDEX;
	}
	const POLAR_POSITION_SCALE_CHANNEL_INDEX = {
	    theta: 1,
	    radius: 1
	};
	const POLAR_POSITION_SCALE_CHANNELS = keys(POLAR_POSITION_SCALE_CHANNEL_INDEX);
	function getPositionScaleChannel(sizeType) {
	    return sizeType === 'width' ? X : Y;
	}
	// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
	const NONPOSITION_SCALE_CHANNEL_INDEX = __rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "url", "description", "detail", "key", "order"]);
	const NONPOSITION_SCALE_CHANNELS = keys(NONPOSITION_SCALE_CHANNEL_INDEX);
	function isNonPositionScaleChannel(channel) {
	    return !!NONPOSITION_CHANNEL_INDEX[channel];
	}
	/**
	 * @returns whether Vega supports legends for a particular channel
	 */
	function supportLegend(channel) {
	    switch (channel) {
	        case COLOR:
	        case FILL:
	        case STROKE:
	        case SIZE:
	        case SHAPE:
	        case OPACITY:
	        case STROKEWIDTH:
	        case STROKEDASH:
	            return true;
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        case ANGLE:
	            return false;
	    }
	}
	// Declare SCALE_CHANNEL_INDEX
	const SCALE_CHANNEL_INDEX = Object.assign(Object.assign(Object.assign({}, POSITION_SCALE_CHANNEL_INDEX), POLAR_POSITION_SCALE_CHANNEL_INDEX), NONPOSITION_SCALE_CHANNEL_INDEX);
	/** List of channels with scales */
	const SCALE_CHANNELS = keys(SCALE_CHANNEL_INDEX);
	function isScaleChannel(channel) {
	    return !!SCALE_CHANNEL_INDEX[channel];
	}
	/**
	 * Return whether a channel supports a particular mark type.
	 * @param channel  channel name
	 * @param mark the mark type
	 * @return whether the mark supports the channel
	 */
	function supportMark(channel, mark) {
	    return getSupportedMark(channel)[mark];
	}
	const ALL_MARKS = {
	    // all marks
	    arc: 'always',
	    area: 'always',
	    bar: 'always',
	    circle: 'always',
	    geoshape: 'always',
	    image: 'always',
	    line: 'always',
	    rule: 'always',
	    point: 'always',
	    rect: 'always',
	    square: 'always',
	    trail: 'always',
	    text: 'always',
	    tick: 'always'
	};
	const ALL_MARKS_EXCEPT_GEOSHAPE = __rest(ALL_MARKS, ["geoshape"]);
	/**
	 * Return a dictionary showing whether a channel supports mark type.
	 * @param channel
	 * @return A dictionary mapping mark types to 'always', 'binned', or undefined
	 */
	function getSupportedMark(channel) {
	    switch (channel) {
	        case COLOR:
	        case FILL:
	        case STROKE:
	        // falls through
	        case DESCRIPTION:
	        case DETAIL:
	        case KEY:
	        case TOOLTIP:
	        case HREF:
	        case ORDER: // TODO: revise (order might not support rect, which is not stackable?)
	        case OPACITY:
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        case STROKEWIDTH:
	        // falls through
	        case FACET:
	        case ROW: // falls through
	        case COLUMN:
	            return ALL_MARKS;
	        case X:
	        case Y:
	        case LATITUDE:
	        case LONGITUDE:
	            // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
	            return ALL_MARKS_EXCEPT_GEOSHAPE;
	        case X2:
	        case Y2:
	        case LATITUDE2:
	        case LONGITUDE2:
	            return {
	                area: 'always',
	                bar: 'always',
	                image: 'always',
	                rect: 'always',
	                rule: 'always',
	                circle: 'binned',
	                point: 'binned',
	                square: 'binned',
	                tick: 'binned',
	                line: 'binned',
	                trail: 'binned'
	            };
	        case SIZE:
	            return {
	                point: 'always',
	                tick: 'always',
	                rule: 'always',
	                circle: 'always',
	                square: 'always',
	                bar: 'always',
	                text: 'always',
	                line: 'always',
	                trail: 'always'
	            };
	        case STROKEDASH:
	            return {
	                line: 'always',
	                point: 'always',
	                tick: 'always',
	                rule: 'always',
	                circle: 'always',
	                square: 'always',
	                bar: 'always',
	                geoshape: 'always'
	            };
	        case SHAPE:
	            return { point: 'always', geoshape: 'always' };
	        case TEXT:
	            return { text: 'always' };
	        case ANGLE:
	            return { point: 'always', square: 'always', text: 'always' };
	        case URL:
	            return { image: 'always' };
	        case THETA:
	            return { text: 'always', arc: 'always' };
	        case RADIUS:
	            return { text: 'always', arc: 'always' };
	        case THETA2:
	        case RADIUS2:
	            return { arc: 'always' };
	    }
	}
	function rangeType(channel) {
	    switch (channel) {
	        case X:
	        case Y:
	        case THETA:
	        case RADIUS:
	        case SIZE:
	        case ANGLE:
	        case STROKEWIDTH:
	        case OPACITY:
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        // X2 and Y2 use X and Y scales, so they similarly have continuous range. [falls through]
	        case X2:
	        case Y2:
	        case THETA2:
	        case RADIUS2:
	            return undefined;
	        case FACET:
	        case ROW:
	        case COLUMN:
	        case SHAPE:
	        case STROKEDASH:
	        // TEXT, TOOLTIP, URL, and HREF have no scale but have discrete output [falls through]
	        case TEXT:
	        case TOOLTIP:
	        case HREF:
	        case URL:
	        case DESCRIPTION:
	            return 'discrete';
	        // Color can be either continuous or discrete, depending on scale type.
	        case COLOR:
	        case FILL:
	        case STROKE:
	            return 'flexible';
	        // No scale, no range type.
	        case LATITUDE:
	        case LONGITUDE:
	        case LATITUDE2:
	        case LONGITUDE2:
	        case DETAIL:
	        case KEY:
	        case ORDER:
	            return undefined;
	    }
	}

	var channel = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ROW: ROW,
		COLUMN: COLUMN,
		FACET: FACET,
		X: X,
		Y: Y,
		X2: X2,
		Y2: Y2,
		RADIUS: RADIUS,
		RADIUS2: RADIUS2,
		THETA: THETA,
		THETA2: THETA2,
		LATITUDE: LATITUDE,
		LONGITUDE: LONGITUDE,
		LATITUDE2: LATITUDE2,
		LONGITUDE2: LONGITUDE2,
		COLOR: COLOR,
		FILL: FILL,
		STROKE: STROKE,
		SHAPE: SHAPE,
		SIZE: SIZE,
		ANGLE: ANGLE,
		OPACITY: OPACITY,
		FILLOPACITY: FILLOPACITY,
		STROKEOPACITY: STROKEOPACITY,
		STROKEWIDTH: STROKEWIDTH,
		STROKEDASH: STROKEDASH,
		TEXT: TEXT,
		ORDER: ORDER,
		DETAIL: DETAIL,
		KEY: KEY,
		TOOLTIP: TOOLTIP,
		HREF: HREF,
		URL: URL,
		DESCRIPTION: DESCRIPTION,
		isPolarPositionChannel: isPolarPositionChannel,
		getPositionChannelFromLatLong: getPositionChannelFromLatLong,
		isGeoPositionChannel: isGeoPositionChannel,
		GEOPOSITION_CHANNELS: GEOPOSITION_CHANNELS,
		isColorChannel: isColorChannel,
		FACET_CHANNELS: FACET_CHANNELS,
		CHANNELS: CHANNELS,
		SINGLE_DEF_CHANNELS: SINGLE_DEF_CHANNELS,
		SINGLE_DEF_UNIT_CHANNELS: SINGLE_DEF_UNIT_CHANNELS,
		isSingleDefUnitChannel: isSingleDefUnitChannel,
		isChannel: isChannel,
		SECONDARY_RANGE_CHANNEL: SECONDARY_RANGE_CHANNEL,
		isSecondaryRangeChannel: isSecondaryRangeChannel,
		getMainRangeChannel: getMainRangeChannel,
		getVgPositionChannel: getVgPositionChannel,
		getSecondaryRangeChannel: getSecondaryRangeChannel,
		getSizeChannel: getSizeChannel,
		getOffsetChannel: getOffsetChannel,
		UNIT_CHANNELS: UNIT_CHANNELS,
		NONPOSITION_CHANNELS: NONPOSITION_CHANNELS,
		POSITION_SCALE_CHANNEL_INDEX: POSITION_SCALE_CHANNEL_INDEX,
		POSITION_SCALE_CHANNELS: POSITION_SCALE_CHANNELS,
		isXorY: isXorY,
		POLAR_POSITION_SCALE_CHANNEL_INDEX: POLAR_POSITION_SCALE_CHANNEL_INDEX,
		POLAR_POSITION_SCALE_CHANNELS: POLAR_POSITION_SCALE_CHANNELS,
		getPositionScaleChannel: getPositionScaleChannel,
		NONPOSITION_SCALE_CHANNELS: NONPOSITION_SCALE_CHANNELS,
		isNonPositionScaleChannel: isNonPositionScaleChannel,
		supportLegend: supportLegend,
		SCALE_CHANNELS: SCALE_CHANNELS,
		isScaleChannel: isScaleChannel,
		supportMark: supportMark,
		rangeType: rangeType
	});

	const CONDITIONAL_AXIS_PROP_INDEX = {
	    labelAlign: {
	        part: 'labels',
	        vgProp: 'align'
	    },
	    labelBaseline: {
	        part: 'labels',
	        vgProp: 'baseline'
	    },
	    labelColor: {
	        part: 'labels',
	        vgProp: 'fill'
	    },
	    labelFont: {
	        part: 'labels',
	        vgProp: 'font'
	    },
	    labelFontSize: {
	        part: 'labels',
	        vgProp: 'fontSize'
	    },
	    labelFontStyle: {
	        part: 'labels',
	        vgProp: 'fontStyle'
	    },
	    labelFontWeight: {
	        part: 'labels',
	        vgProp: 'fontWeight'
	    },
	    labelOpacity: {
	        part: 'labels',
	        vgProp: 'opacity'
	    },
	    labelOffset: null,
	    labelPadding: null,
	    gridColor: {
	        part: 'grid',
	        vgProp: 'stroke'
	    },
	    gridDash: {
	        part: 'grid',
	        vgProp: 'strokeDash'
	    },
	    gridDashOffset: {
	        part: 'grid',
	        vgProp: 'strokeDashOffset'
	    },
	    gridOpacity: {
	        part: 'grid',
	        vgProp: 'opacity'
	    },
	    gridWidth: {
	        part: 'grid',
	        vgProp: 'strokeWidth'
	    },
	    tickColor: {
	        part: 'ticks',
	        vgProp: 'stroke'
	    },
	    tickDash: {
	        part: 'ticks',
	        vgProp: 'strokeDash'
	    },
	    tickDashOffset: {
	        part: 'ticks',
	        vgProp: 'strokeDashOffset'
	    },
	    tickOpacity: {
	        part: 'ticks',
	        vgProp: 'opacity'
	    },
	    tickSize: null,
	    tickWidth: {
	        part: 'ticks',
	        vgProp: 'strokeWidth'
	    }
	};
	function isConditionalAxisValue(v) {
	    return v && v['condition'];
	}
	const AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
	/**
	 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
	 */
	const AXIS_PROPERTY_TYPE = {
	    grid: 'grid',
	    gridCap: 'grid',
	    gridColor: 'grid',
	    gridDash: 'grid',
	    gridDashOffset: 'grid',
	    gridOpacity: 'grid',
	    gridScale: 'grid',
	    gridWidth: 'grid',
	    orient: 'main',
	    bandPosition: 'both',
	    aria: 'main',
	    description: 'main',
	    domain: 'main',
	    domainCap: 'main',
	    domainColor: 'main',
	    domainDash: 'main',
	    domainDashOffset: 'main',
	    domainOpacity: 'main',
	    domainWidth: 'main',
	    format: 'main',
	    formatType: 'main',
	    labelAlign: 'main',
	    labelAngle: 'main',
	    labelBaseline: 'main',
	    labelBound: 'main',
	    labelColor: 'main',
	    labelFlush: 'main',
	    labelFlushOffset: 'main',
	    labelFont: 'main',
	    labelFontSize: 'main',
	    labelFontStyle: 'main',
	    labelFontWeight: 'main',
	    labelLimit: 'main',
	    labelLineHeight: 'main',
	    labelOffset: 'main',
	    labelOpacity: 'main',
	    labelOverlap: 'main',
	    labelPadding: 'main',
	    labels: 'main',
	    labelSeparation: 'main',
	    maxExtent: 'main',
	    minExtent: 'main',
	    offset: 'both',
	    position: 'main',
	    tickCap: 'main',
	    tickColor: 'main',
	    tickDash: 'main',
	    tickDashOffset: 'main',
	    tickMinStep: 'main',
	    tickOffset: 'both',
	    tickOpacity: 'main',
	    tickRound: 'both',
	    ticks: 'main',
	    tickSize: 'main',
	    tickWidth: 'both',
	    title: 'main',
	    titleAlign: 'main',
	    titleAnchor: 'main',
	    titleAngle: 'main',
	    titleBaseline: 'main',
	    titleColor: 'main',
	    titleFont: 'main',
	    titleFontSize: 'main',
	    titleFontStyle: 'main',
	    titleFontWeight: 'main',
	    titleLimit: 'main',
	    titleLineHeight: 'main',
	    titleOpacity: 'main',
	    titlePadding: 'main',
	    titleX: 'main',
	    titleY: 'main',
	    encode: 'both',
	    scale: 'both',
	    tickBand: 'both',
	    tickCount: 'both',
	    tickExtra: 'both',
	    translate: 'both',
	    values: 'both',
	    zindex: 'both' // this is actually set afterward, so it doesn't matter
	};
	const COMMON_AXIS_PROPERTIES_INDEX = {
	    orient: 1,
	    aria: 1,
	    bandPosition: 1,
	    description: 1,
	    domain: 1,
	    domainCap: 1,
	    domainColor: 1,
	    domainDash: 1,
	    domainDashOffset: 1,
	    domainOpacity: 1,
	    domainWidth: 1,
	    format: 1,
	    formatType: 1,
	    grid: 1,
	    gridCap: 1,
	    gridColor: 1,
	    gridDash: 1,
	    gridDashOffset: 1,
	    gridOpacity: 1,
	    gridWidth: 1,
	    labelAlign: 1,
	    labelAngle: 1,
	    labelBaseline: 1,
	    labelBound: 1,
	    labelColor: 1,
	    labelFlush: 1,
	    labelFlushOffset: 1,
	    labelFont: 1,
	    labelFontSize: 1,
	    labelFontStyle: 1,
	    labelFontWeight: 1,
	    labelLimit: 1,
	    labelLineHeight: 1,
	    labelOffset: 1,
	    labelOpacity: 1,
	    labelOverlap: 1,
	    labelPadding: 1,
	    labels: 1,
	    labelSeparation: 1,
	    maxExtent: 1,
	    minExtent: 1,
	    offset: 1,
	    position: 1,
	    tickBand: 1,
	    tickCap: 1,
	    tickColor: 1,
	    tickCount: 1,
	    tickDash: 1,
	    tickDashOffset: 1,
	    tickExtra: 1,
	    tickMinStep: 1,
	    tickOffset: 1,
	    tickOpacity: 1,
	    tickRound: 1,
	    ticks: 1,
	    tickSize: 1,
	    tickWidth: 1,
	    title: 1,
	    titleAlign: 1,
	    titleAnchor: 1,
	    titleAngle: 1,
	    titleBaseline: 1,
	    titleColor: 1,
	    titleFont: 1,
	    titleFontSize: 1,
	    titleFontStyle: 1,
	    titleFontWeight: 1,
	    titleLimit: 1,
	    titleLineHeight: 1,
	    titleOpacity: 1,
	    titlePadding: 1,
	    titleX: 1,
	    titleY: 1,
	    translate: 1,
	    values: 1,
	    zindex: 1
	};
	const AXIS_PROPERTIES_INDEX = Object.assign(Object.assign({}, COMMON_AXIS_PROPERTIES_INDEX), { style: 1, labelExpr: 1, encoding: 1 });
	function isAxisProperty(prop) {
	    return !!AXIS_PROPERTIES_INDEX[prop];
	}
	// Export for dependent projects
	const AXIS_PROPERTIES = keys(AXIS_PROPERTIES_INDEX);
	const AXIS_CONFIGS_INDEX = {
	    axis: 1,
	    axisBand: 1,
	    axisBottom: 1,
	    axisDiscrete: 1,
	    axisLeft: 1,
	    axisPoint: 1,
	    axisQuantitative: 1,
	    axisRight: 1,
	    axisTemporal: 1,
	    axisTop: 1,
	    axisX: 1,
	    axisXBand: 1,
	    axisXDiscrete: 1,
	    axisXPoint: 1,
	    axisXQuantitative: 1,
	    axisXTemporal: 1,
	    axisY: 1,
	    axisYBand: 1,
	    axisYDiscrete: 1,
	    axisYPoint: 1,
	    axisYQuantitative: 1,
	    axisYTemporal: 1
	};
	const AXIS_CONFIGS = keys(AXIS_CONFIGS_INDEX);

	var axis = /*#__PURE__*/Object.freeze({
		__proto__: null,
		CONDITIONAL_AXIS_PROP_INDEX: CONDITIONAL_AXIS_PROP_INDEX,
		isConditionalAxisValue: isConditionalAxisValue,
		AXIS_PARTS: AXIS_PARTS,
		AXIS_PROPERTY_TYPE: AXIS_PROPERTY_TYPE,
		COMMON_AXIS_PROPERTIES_INDEX: COMMON_AXIS_PROPERTIES_INDEX,
		isAxisProperty: isAxisProperty,
		AXIS_PROPERTIES: AXIS_PROPERTIES,
		AXIS_CONFIGS: AXIS_CONFIGS
	});

	const LEGEND_SCALE_CHANNELS = [
	    'size',
	    'shape',
	    'fill',
	    'stroke',
	    'strokeDash',
	    'strokeWidth',
	    'opacity'
	];
	const defaultLegendConfig = {
	    gradientHorizontalMaxLength: 200,
	    gradientHorizontalMinLength: 100,
	    gradientVerticalMaxLength: 200,
	    gradientVerticalMinLength: 64,
	    unselectedOpacity: 0.35
	};
	const COMMON_LEGEND_PROPERTY_INDEX = {
	    aria: 1,
	    clipHeight: 1,
	    columnPadding: 1,
	    columns: 1,
	    cornerRadius: 1,
	    description: 1,
	    direction: 1,
	    fillColor: 1,
	    format: 1,
	    formatType: 1,
	    gradientLength: 1,
	    gradientOpacity: 1,
	    gradientStrokeColor: 1,
	    gradientStrokeWidth: 1,
	    gradientThickness: 1,
	    gridAlign: 1,
	    labelAlign: 1,
	    labelBaseline: 1,
	    labelColor: 1,
	    labelFont: 1,
	    labelFontSize: 1,
	    labelFontStyle: 1,
	    labelFontWeight: 1,
	    labelLimit: 1,
	    labelOffset: 1,
	    labelOpacity: 1,
	    labelOverlap: 1,
	    labelPadding: 1,
	    labelSeparation: 1,
	    legendX: 1,
	    legendY: 1,
	    offset: 1,
	    orient: 1,
	    padding: 1,
	    rowPadding: 1,
	    strokeColor: 1,
	    symbolDash: 1,
	    symbolDashOffset: 1,
	    symbolFillColor: 1,
	    symbolLimit: 1,
	    symbolOffset: 1,
	    symbolOpacity: 1,
	    symbolSize: 1,
	    symbolStrokeColor: 1,
	    symbolStrokeWidth: 1,
	    symbolType: 1,
	    tickCount: 1,
	    tickMinStep: 1,
	    title: 1,
	    titleAlign: 1,
	    titleAnchor: 1,
	    titleBaseline: 1,
	    titleColor: 1,
	    titleFont: 1,
	    titleFontSize: 1,
	    titleFontStyle: 1,
	    titleFontWeight: 1,
	    titleLimit: 1,
	    titleLineHeight: 1,
	    titleOpacity: 1,
	    titleOrient: 1,
	    titlePadding: 1,
	    type: 1,
	    values: 1,
	    zindex: 1
	};
	const LEGEND_PROPERTIES = keys(COMMON_LEGEND_PROPERTY_INDEX);

	var legend = /*#__PURE__*/Object.freeze({
		__proto__: null,
		LEGEND_SCALE_CHANNELS: LEGEND_SCALE_CHANNELS,
		defaultLegendConfig: defaultLegendConfig,
		COMMON_LEGEND_PROPERTY_INDEX: COMMON_LEGEND_PROPERTY_INDEX,
		LEGEND_PROPERTIES: LEGEND_PROPERTIES
	});

	// ENCODING & FACET
	function customFormatTypeNotAllowed(channel) {
	    return `Config.customFormatTypes is not true, thus custom format type and format for channel ${channel} are dropped.`;
	}
	function primitiveChannelDef(channel, type, value) {
	    return `Channel ${channel} is a ${type}. Converted to {value: ${stringify(value)}}.`;
	}
	function invalidFieldType(type) {
	    return `Invalid field type "${type}".`;
	}
	function invalidFieldTypeForCountAggregate(type, aggregate) {
	    return `Invalid field type "${type}" for aggregate: "${aggregate}", using "quantitative" instead.`;
	}
	function invalidAggregate(aggregate) {
	    return `Invalid aggregation operator "${aggregate}".`;
	}
	function facetChannelShouldBeDiscrete(channel) {
	    return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
	}
	function discreteChannelCannotEncode(channel, type) {
	    return `Using discrete channel "${channel}" to encode "${type}" field can be misleading as it does not encode ${type === 'ordinal' ? 'order' : 'magnitude'}.`;
	}
	function cannotUseScalePropertyWithNonColor(prop) {
	    return `Cannot use the scale property "${prop}" with non-color channel.`;
	}
	function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
	    return `Channel "${channel}" does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
	}
	function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
	    return `FieldDef does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
	}
	// STACK
	function cannotStackRangedMark(channel) {
	    return `Cannot stack "${channel}" if there is already "${channel}2".`;
	}
	function cannotStackNonLinearScale(scaleType) {
	    return `Cannot stack non-linear scale (${scaleType}).`;
	}
	function stackNonSummativeAggregate(aggregate) {
	    return `Stacking is applied even though the aggregate function is non-summative ("${aggregate}").`;
	}
	// TIMEUNIT
	function invalidTimeUnit(unitName, value) {
	    return `Invalid ${unitName}: ${stringify(value)}.`;
	}
	function droppedDay(d) {
	    return `Dropping day from datetime ${stringify(d)} as day cannot be combined with other units.`;
	}
	function channelShouldNotBeUsedForBinned(channel) {
	    return `Channel ${channel} should not be used with "binned" bin.`;
	}

	/**
	 * Vega-Lite's singleton logger utility.
	 */
	var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to set private field on non-instance");
	    }
	    privateMap.set(receiver, value);
	    return value;
	};
	var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to get private field on non-instance");
	    }
	    return privateMap.get(receiver);
	};
	/**
	 * Main (default) Vega Logger instance for Vega-Lite.
	 */
	const main = logger(Warn);
	let current = main;
	function warn(...args) {
	    current.warn(...args);
	}

	/**
	 * Data type based on level of measurement
	 */
	const Type = {
	    quantitative: 'quantitative',
	    ordinal: 'ordinal',
	    temporal: 'temporal',
	    nominal: 'nominal',
	    geojson: 'geojson'
	};
	function isType(t) {
	    return t in Type;
	}
	const QUANTITATIVE = Type.quantitative;
	const ORDINAL = Type.ordinal;
	const TEMPORAL = Type.temporal;
	const NOMINAL = Type.nominal;
	const GEOJSON = Type.geojson;
	const TYPES = keys(Type);
	/**
	 * Get full, lowercase type name for a given type.
	 * @param  type
	 * @return Full type name.
	 */
	function getFullName(type) {
	    if (type) {
	        type = type.toLowerCase();
	        switch (type) {
	            case 'q':
	            case QUANTITATIVE:
	                return 'quantitative';
	            case 't':
	            case TEMPORAL:
	                return 'temporal';
	            case 'o':
	            case ORDINAL:
	                return 'ordinal';
	            case 'n':
	            case NOMINAL:
	                return 'nominal';
	            case GEOJSON:
	                return 'geojson';
	        }
	    }
	    // If we get invalid input, return undefined type.
	    return undefined;
	}

	var type = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Type: Type,
		isType: isType,
		QUANTITATIVE: QUANTITATIVE,
		ORDINAL: ORDINAL,
		TEMPORAL: TEMPORAL,
		NOMINAL: NOMINAL,
		GEOJSON: GEOJSON,
		TYPES: TYPES,
		getFullName: getFullName
	});

	var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	const ScaleType = {
	    // Continuous - Quantitative
	    LINEAR: 'linear',
	    LOG: 'log',
	    POW: 'pow',
	    SQRT: 'sqrt',
	    SYMLOG: 'symlog',
	    IDENTITY: 'identity',
	    SEQUENTIAL: 'sequential',
	    // Continuous - Time
	    TIME: 'time',
	    UTC: 'utc',
	    // Discretizing scales
	    QUANTILE: 'quantile',
	    QUANTIZE: 'quantize',
	    THRESHOLD: 'threshold',
	    BIN_ORDINAL: 'bin-ordinal',
	    // Discrete scales
	    ORDINAL: 'ordinal',
	    POINT: 'point',
	    BAND: 'band'
	};
	/**
	 * Index for scale categories -- only scale of the same categories can be merged together.
	 * Current implementation is trying to be conservative and avoid merging scale type that might not work together
	 */
	const SCALE_CATEGORY_INDEX = {
	    linear: 'numeric',
	    log: 'numeric',
	    pow: 'numeric',
	    sqrt: 'numeric',
	    symlog: 'numeric',
	    identity: 'numeric',
	    sequential: 'numeric',
	    time: 'time',
	    utc: 'time',
	    ordinal: 'ordinal',
	    'bin-ordinal': 'bin-ordinal',
	    point: 'ordinal-position',
	    band: 'ordinal-position',
	    quantile: 'discretizing',
	    quantize: 'discretizing',
	    threshold: 'discretizing'
	};
	const SCALE_TYPES = keys(SCALE_CATEGORY_INDEX);
	/**
	 * Whether the two given scale types can be merged together.
	 */
	function scaleCompatible(scaleType1, scaleType2) {
	    const scaleCategory1 = SCALE_CATEGORY_INDEX[scaleType1];
	    const scaleCategory2 = SCALE_CATEGORY_INDEX[scaleType2];
	    return (scaleCategory1 === scaleCategory2 ||
	        (scaleCategory1 === 'ordinal-position' && scaleCategory2 === 'time') ||
	        (scaleCategory2 === 'ordinal-position' && scaleCategory1 === 'time'));
	}
	/**
	 * Index for scale precedence -- high score = higher priority for merging.
	 */
	const SCALE_PRECEDENCE_INDEX = {
	    // numeric
	    linear: 0,
	    log: 1,
	    pow: 1,
	    sqrt: 1,
	    symlog: 1,
	    identity: 1,
	    sequential: 1,
	    // time
	    time: 0,
	    utc: 0,
	    // ordinal-position -- these have higher precedence than continuous scales as they support more types of data
	    point: 10,
	    band: 11,
	    // non grouped types
	    ordinal: 0,
	    'bin-ordinal': 0,
	    quantile: 0,
	    quantize: 0,
	    threshold: 0
	};
	/**
	 * Return scale categories -- only scale of the same categories can be merged together.
	 */
	function scaleTypePrecedence(scaleType) {
	    return SCALE_PRECEDENCE_INDEX[scaleType];
	}
	const CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'log', 'pow', 'sqrt', 'symlog', 'time', 'utc'];
	const CONTINUOUS_TO_CONTINUOUS_INDEX = toSet(CONTINUOUS_TO_CONTINUOUS_SCALES);
	const QUANTITATIVE_SCALES = ['linear', 'log', 'pow', 'sqrt', 'symlog'];
	const QUANTITATIVE_SCALES_INDEX = toSet(QUANTITATIVE_SCALES);
	function isQuantitative(type) {
	    return type in QUANTITATIVE_SCALES_INDEX;
	}
	const CONTINUOUS_TO_DISCRETE_SCALES = ['quantile', 'quantize', 'threshold'];
	const CONTINUOUS_TO_DISCRETE_INDEX = toSet(CONTINUOUS_TO_DISCRETE_SCALES);
	const CONTINUOUS_DOMAIN_SCALES = CONTINUOUS_TO_CONTINUOUS_SCALES.concat([
	    'quantile',
	    'quantize',
	    'threshold',
	    'sequential',
	    'identity'
	]);
	const CONTINUOUS_DOMAIN_INDEX = toSet(CONTINUOUS_DOMAIN_SCALES);
	const DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
	const DISCRETE_DOMAIN_INDEX = toSet(DISCRETE_DOMAIN_SCALES);
	const TIME_SCALE_TYPES = ['time', 'utc'];
	function hasDiscreteDomain(type) {
	    return type in DISCRETE_DOMAIN_INDEX;
	}
	function hasContinuousDomain(type) {
	    return type in CONTINUOUS_DOMAIN_INDEX;
	}
	function isContinuousToContinuous(type) {
	    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
	}
	function isContinuousToDiscrete(type) {
	    return type in CONTINUOUS_TO_DISCRETE_INDEX;
	}
	const defaultScaleConfig = {
	    pointPadding: 0.5,
	    barBandPaddingInner: 0.1,
	    rectBandPaddingInner: 0,
	    minBandSize: 2,
	    minFontSize: 8,
	    maxFontSize: 40,
	    minOpacity: 0.3,
	    maxOpacity: 0.8,
	    // FIXME: revise if these *can* become ratios of width/height step
	    minSize: 9,
	    minStrokeWidth: 1,
	    maxStrokeWidth: 4,
	    quantileCount: 4,
	    quantizeCount: 4
	};
	function isExtendedScheme(scheme) {
	    return !isString(scheme) && !!scheme['name'];
	}
	function isSelectionDomain(domain) {
	    return domain === null || domain === void 0 ? void 0 : domain['selection'];
	}
	function isDomainUnionWith(domain) {
	    return domain && domain['unionWith'];
	}
	const SCALE_PROPERTY_INDEX = {
	    type: 1,
	    domain: 1,
	    domainMax: 1,
	    domainMin: 1,
	    domainMid: 1,
	    align: 1,
	    range: 1,
	    rangeMax: 1,
	    rangeMin: 1,
	    scheme: 1,
	    bins: 1,
	    // Other properties
	    reverse: 1,
	    round: 1,
	    // quantitative / time
	    clamp: 1,
	    nice: 1,
	    // quantitative
	    base: 1,
	    exponent: 1,
	    constant: 1,
	    interpolate: 1,
	    zero: 1,
	    // band/point
	    padding: 1,
	    paddingInner: 1,
	    paddingOuter: 1
	};
	const SCALE_PROPERTIES = keys(SCALE_PROPERTY_INDEX);
	const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX = __rest$1(SCALE_PROPERTY_INDEX, ["type", "domain", "range", "rangeMax", "rangeMin", "scheme"]);
	const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = keys(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX);
	function scaleTypeSupportProperty(scaleType, propName) {
	    switch (propName) {
	        case 'type':
	        case 'domain':
	        case 'reverse':
	        case 'range':
	            return true;
	        case 'scheme':
	        case 'interpolate':
	            return !contains(['point', 'band', 'identity'], scaleType);
	        case 'bins':
	            return !contains(['point', 'band', 'identity', 'ordinal'], scaleType);
	        case 'round':
	            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
	        case 'padding':
	        case 'rangeMin':
	        case 'rangeMax':
	            return isContinuousToContinuous(scaleType) || contains(['point', 'band'], scaleType);
	        case 'paddingOuter':
	        case 'align':
	            return contains(['point', 'band'], scaleType);
	        case 'paddingInner':
	            return scaleType === 'band';
	        case 'domainMax':
	        case 'domainMid':
	        case 'domainMin':
	        case 'clamp':
	            return isContinuousToContinuous(scaleType);
	        case 'nice':
	            return isContinuousToContinuous(scaleType) || scaleType === 'quantize' || scaleType === 'threshold';
	        case 'exponent':
	            return scaleType === 'pow';
	        case 'base':
	            return scaleType === 'log';
	        case 'constant':
	            return scaleType === 'symlog';
	        case 'zero':
	            return (hasContinuousDomain(scaleType) &&
	                !contains([
	                    'log',
	                    'time',
	                    'utc',
	                    'threshold',
	                    'quantile' // quantile depends on distribution so zero does not matter
	                ], scaleType));
	    }
	}
	/**
	 * Returns undefined if the input channel supports the input scale property name
	 */
	function channelScalePropertyIncompatability(channel, propName) {
	    switch (propName) {
	        case 'interpolate':
	        case 'scheme':
	        case 'domainMid':
	            if (!isColorChannel(channel)) {
	                return cannotUseScalePropertyWithNonColor(channel);
	            }
	            return undefined;
	        case 'align':
	        case 'type':
	        case 'bins':
	        case 'domain':
	        case 'domainMax':
	        case 'domainMin':
	        case 'range':
	        case 'base':
	        case 'exponent':
	        case 'constant':
	        case 'nice':
	        case 'padding':
	        case 'paddingInner':
	        case 'paddingOuter':
	        case 'rangeMax':
	        case 'rangeMin':
	        case 'reverse':
	        case 'round':
	        case 'clamp':
	        case 'zero':
	            return undefined; // GOOD!
	    }
	}
	function scaleTypeSupportDataType(specifiedType, fieldDefType) {
	    if (contains([ORDINAL, NOMINAL], fieldDefType)) {
	        return specifiedType === undefined || hasDiscreteDomain(specifiedType);
	    }
	    else if (fieldDefType === TEMPORAL) {
	        return contains([ScaleType.TIME, ScaleType.UTC, undefined], specifiedType);
	    }
	    else if (fieldDefType === QUANTITATIVE) {
	        return contains([
	            ScaleType.LOG,
	            ScaleType.POW,
	            ScaleType.SQRT,
	            ScaleType.SYMLOG,
	            ScaleType.QUANTILE,
	            ScaleType.QUANTIZE,
	            ScaleType.THRESHOLD,
	            ScaleType.LINEAR,
	            undefined
	        ], specifiedType);
	    }
	    return true;
	}
	function channelSupportScaleType(channel$1, scaleType) {
	    if (!isScaleChannel(channel$1)) {
	        return false;
	    }
	    switch (channel$1) {
	        case X:
	        case Y:
	        case THETA:
	        case RADIUS:
	            return isContinuousToContinuous(scaleType) || contains(['band', 'point'], scaleType);
	        case SIZE: // TODO: size and opacity can support ordinal with more modification
	        case STROKEWIDTH:
	        case OPACITY:
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        case ANGLE:
	            // Although it generally doesn't make sense to use band with size and opacity,
	            // it can also work since we use band: 0.5 to get midpoint.
	            return (isContinuousToContinuous(scaleType) ||
	                isContinuousToDiscrete(scaleType) ||
	                contains(['band', 'point', 'ordinal'], scaleType));
	        case COLOR:
	        case FILL:
	        case STROKE:
	            return scaleType !== 'band'; // band does not make sense with color
	        case STROKEDASH:
	            return scaleType === 'ordinal' || isContinuousToDiscrete(scaleType);
	        case SHAPE:
	            return scaleType === 'ordinal'; // shape = lookup only
	    }
	}

	var scale = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ScaleType: ScaleType,
		SCALE_CATEGORY_INDEX: SCALE_CATEGORY_INDEX,
		SCALE_TYPES: SCALE_TYPES,
		scaleCompatible: scaleCompatible,
		scaleTypePrecedence: scaleTypePrecedence,
		CONTINUOUS_TO_CONTINUOUS_SCALES: CONTINUOUS_TO_CONTINUOUS_SCALES,
		QUANTITATIVE_SCALES: QUANTITATIVE_SCALES,
		isQuantitative: isQuantitative,
		CONTINUOUS_TO_DISCRETE_SCALES: CONTINUOUS_TO_DISCRETE_SCALES,
		CONTINUOUS_DOMAIN_SCALES: CONTINUOUS_DOMAIN_SCALES,
		DISCRETE_DOMAIN_SCALES: DISCRETE_DOMAIN_SCALES,
		TIME_SCALE_TYPES: TIME_SCALE_TYPES,
		hasDiscreteDomain: hasDiscreteDomain,
		hasContinuousDomain: hasContinuousDomain,
		isContinuousToContinuous: isContinuousToContinuous,
		isContinuousToDiscrete: isContinuousToDiscrete,
		defaultScaleConfig: defaultScaleConfig,
		isExtendedScheme: isExtendedScheme,
		isSelectionDomain: isSelectionDomain,
		isDomainUnionWith: isDomainUnionWith,
		SCALE_PROPERTIES: SCALE_PROPERTIES,
		NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES,
		scaleTypeSupportProperty: scaleTypeSupportProperty,
		channelScalePropertyIncompatability: channelScalePropertyIncompatability,
		scaleTypeSupportDataType: scaleTypeSupportDataType,
		channelSupportScaleType: channelSupportScaleType
	});

	var util = createCommonjsModule(function (module) {
	var u = module.exports;

	// utility functions

	var FNAME = '__name__';

	u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

	u.name = function(f) { return f==null ? null : f[FNAME]; };

	u.identity = function(x) { return x; };

	u.true = u.namedfunc('true', function() { return true; });

	u.false = u.namedfunc('false', function() { return false; });

	u.duplicate = function(obj) {
	  return JSON.parse(JSON.stringify(obj));
	};

	u.equal = function(a, b) {
	  return JSON.stringify(a) === JSON.stringify(b);
	};

	u.extend = function(obj) {
	  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
	    x = arguments[i];
	    for (name in x) { obj[name] = x[name]; }
	  }
	  return obj;
	};

	u.length = function(x) {
	  return x != null && x.length != null ? x.length : null;
	};

	u.keys = function(x) {
	  var keys = [], k;
	  for (k in x) keys.push(k);
	  return keys;
	};

	u.vals = function(x) {
	  var vals = [], k;
	  for (k in x) vals.push(x[k]);
	  return vals;
	};

	u.toMap = function(list, f) {
	  return (f = u.$(f)) ?
	    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
	    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
	};

	u.keystr = function(values) {
	  // use to ensure consistent key generation across modules
	  var n = values.length;
	  if (!n) return '';
	  for (var s=String(values[0]), i=1; i<n; ++i) {
	    s += '|' + String(values[i]);
	  }
	  return s;
	};

	// type checking functions

	var toString = Object.prototype.toString;

	u.isObject = function(obj) {
	  return obj === Object(obj);
	};

	u.isFunction = function(obj) {
	  return toString.call(obj) === '[object Function]';
	};

	u.isString = function(obj) {
	  return typeof value === 'string' || toString.call(obj) === '[object String]';
	};

	u.isArray = Array.isArray || function(obj) {
	  return toString.call(obj) === '[object Array]';
	};

	u.isNumber = function(obj) {
	  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
	};

	u.isBoolean = function(obj) {
	  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};

	u.isDate = function(obj) {
	  return toString.call(obj) === '[object Date]';
	};

	u.isValid = function(obj) {
	  return obj != null && obj === obj;
	};

	u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;

	// type coercion functions

	u.number = function(s) {
	  return s == null || s === '' ? null : +s;
	};

	u.boolean = function(s) {
	  return s == null || s === '' ? null : s==='false' ? false : !!s;
	};

	// parse a date with optional d3.time-format format
	u.date = function(s, format) {
	  var d = format ? format : Date;
	  return s == null || s === '' ? null : d.parse(s);
	};

	u.array = function(x) {
	  return x != null ? (u.isArray(x) ? x : [x]) : [];
	};

	u.str = function(x) {
	  return u.isArray(x) ? '[' + x.map(u.str) + ']'
	    : u.isObject(x) || u.isString(x) ?
	      // Output valid JSON and JS source strings.
	      // See http://timelessrepo.com/json-isnt-a-javascript-subset
	      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
	    : x;
	};

	// data access functions

	var field_re = /\[(.*?)\]|[^.\[]+/g;

	u.field = function(f) {
	  return String(f).match(field_re).map(function(d) {
	    return d[0] !== '[' ? d :
	      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
	      d.slice(2, -2).replace(/\\(["'])/g, '$1');
	  });
	};

	u.accessor = function(f) {
	  /* jshint evil: true */
	  return f==null || u.isFunction(f) ? f :
	    u.namedfunc(f, Function('x', 'return x[' + u.field(f).map(u.str).join('][') + '];'));
	};

	// short-cut for accessor
	u.$ = u.accessor;

	u.mutator = function(f) {
	  var s;
	  return u.isString(f) && (s=u.field(f)).length > 1 ?
	    function(x, v) {
	      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
	      x[s[i]] = v;
	    } :
	    function(x, v) { x[f] = v; };
	};


	u.$func = function(name, op) {
	  return function(f) {
	    f = u.$(f) || u.identity;
	    var n = name + (u.name(f) ? '_'+u.name(f) : '');
	    return u.namedfunc(n, function(d) { return op(f(d)); });
	  };
	};

	u.$valid  = u.$func('valid', u.isValid);
	u.$length = u.$func('length', u.length);

	u.$in = function(f, values) {
	  f = u.$(f);
	  var map = u.isArray(values) ? u.toMap(values) : values;
	  return function(d) { return !!map[f(d)]; };
	};

	// comparison / sorting functions

	u.comparator = function(sort) {
	  var sign = [];
	  if (sort === undefined) sort = [];
	  sort = u.array(sort).map(function(f) {
	    var s = 1;
	    if      (f[0] === '-') { s = -1; f = f.slice(1); }
	    else if (f[0] === '+') { s = +1; f = f.slice(1); }
	    sign.push(s);
	    return u.accessor(f);
	  });
	  return function(a, b) {
	    var i, n, f, c;
	    for (i=0, n=sort.length; i<n; ++i) {
	      f = sort[i];
	      c = u.cmp(f(a), f(b));
	      if (c) return c * sign[i];
	    }
	    return 0;
	  };
	};

	u.cmp = function(a, b) {
	  return (a < b || a == null) && b != null ? -1 :
	    (a > b || b == null) && a != null ? 1 :
	    ((b = b instanceof Date ? +b : b),
	     (a = a instanceof Date ? +a : a)) !== a && b === b ? -1 :
	    b !== b && a === a ? 1 : 0;
	};

	u.numcmp = function(a, b) { return a - b; };

	u.stablesort = function(array, sortBy, keyFn) {
	  var indices = array.reduce(function(idx, v, i) {
	    return (idx[keyFn(v)] = i, idx);
	  }, {});

	  array.sort(function(a, b) {
	    var sa = sortBy(a),
	        sb = sortBy(b);
	    return sa < sb ? -1 : sa > sb ? 1
	         : (indices[keyFn(a)] - indices[keyFn(b)]);
	  });

	  return array;
	};

	// permutes an array using a Knuth shuffle
	u.permute = function(a) {
	  var m = a.length,
	      swap,
	      i;

	  while (m) {
	    i = Math.floor(Math.random() * m--);
	    swap = a[m];
	    a[m] = a[i];
	    a[i] = swap;
	  }
	};

	// string functions

	u.pad = function(s, length, pos, padchar) {
	  padchar = padchar || " ";
	  var d = length - s.length;
	  if (d <= 0) return s;
	  switch (pos) {
	    case 'left':
	      return strrep(d, padchar) + s;
	    case 'middle':
	    case 'center':
	      return strrep(Math.floor(d/2), padchar) +
	         s + strrep(Math.ceil(d/2), padchar);
	    default:
	      return s + strrep(d, padchar);
	  }
	};

	function strrep(n, str) {
	  var s = "", i;
	  for (i=0; i<n; ++i) s += str;
	  return s;
	}

	u.truncate = function(s, length, pos, word, ellipsis) {
	  var len = s.length;
	  if (len <= length) return s;
	  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
	  var l = Math.max(0, length - ellipsis.length);

	  switch (pos) {
	    case 'left':
	      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
	    case 'middle':
	    case 'center':
	      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
	      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
	        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
	    default:
	      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
	  }
	};

	function truncateOnWord(s, len, rev) {
	  var cnt = 0, tok = s.split(truncate_word_re);
	  if (rev) {
	    s = (tok = tok.reverse())
	      .filter(function(w) { cnt += w.length; return cnt <= len; })
	      .reverse();
	  } else {
	    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
	  }
	  return s.length ? s.join('').trim() : tok[0].slice(0, len);
	}

	var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;
	});

	var util$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.flagKeys = exports.without = exports.nestedMap = exports.some = exports.forEach = exports.every = exports.contains = exports.isArray = exports.toMap = exports.isBoolean = exports.isObject = exports.extend = exports.duplicate = exports.keys = exports.cmp = void 0;

	Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return util.isArray; } });
	var util_2 = util;
	Object.defineProperty(exports, "cmp", { enumerable: true, get: function () { return util_2.cmp; } });
	Object.defineProperty(exports, "keys", { enumerable: true, get: function () { return util_2.keys; } });
	Object.defineProperty(exports, "duplicate", { enumerable: true, get: function () { return util_2.duplicate; } });
	Object.defineProperty(exports, "extend", { enumerable: true, get: function () { return util_2.extend; } });
	Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return util_2.isObject; } });
	Object.defineProperty(exports, "isBoolean", { enumerable: true, get: function () { return util_2.isBoolean; } });
	Object.defineProperty(exports, "toMap", { enumerable: true, get: function () { return util_2.toMap; } });
	function contains(array, item) {
	    return array.indexOf(item) !== -1;
	}
	exports.contains = contains;
	function every(arr, f) {
	    for (let i = 0; i < arr.length; i++) {
	        if (!f(arr[i], i)) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.every = every;
	function forEach(obj, f, thisArg) {
	    if (obj.forEach) {
	        obj.forEach.call(thisArg, f);
	    }
	    else {
	        for (let k in obj) {
	            f.call(thisArg, obj[k], k, obj);
	        }
	    }
	}
	exports.forEach = forEach;
	function some(arr, f) {
	    let i = 0;
	    let k;
	    for (k in arr) {
	        if (f(arr[k], k, i++)) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.some = some;
	function nestedMap(array, f) {
	    return array.map((a) => {
	        if (util.isArray(a)) {
	            return nestedMap(a, f);
	        }
	        return f(a);
	    });
	}
	exports.nestedMap = nestedMap;
	/** Returns the array without the elements in item */
	function without(array, excludedItems) {
	    return array.filter(function (item) {
	        return !contains(excludedItems, item);
	    });
	}
	exports.without = without;
	function flagKeys(f) {
	    return Object.keys(f);
	}
	exports.flagKeys = flagKeys;

	});

	var axis_1 = /*@__PURE__*/getAugmentedNamespace(axis);

	var legend_1 = /*@__PURE__*/getAugmentedNamespace(legend);

	var scale_1 = /*@__PURE__*/getAugmentedNamespace(scale);

	var property = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Property = exports.DEFAULT_PROP_PRECEDENCE = exports.ALL_ENCODING_PROPS = exports.isEncodingProperty = exports.getEncodingNestedProp = exports.fromKey = exports.toKey = exports.VIEW_PROPS = exports.ENCODING_NESTED_PROPS = exports.SCALE_PROPS = exports.SORT_PROPS = exports.SORT_CHILD_PROPS = exports.BIN_CHILD_PROPS = exports.isEncodingNestedParent = exports.isEncodingTopLevelProperty = exports.ENCODING_TOPLEVEL_PROPS = exports.isEncodingNestedProp = void 0;




	function isEncodingNestedProp(p) {
	    return !!p['parent'];
	}
	exports.isEncodingNestedProp = isEncodingNestedProp;
	const ENCODING_TOPLEVEL_PROP_INDEX = {
	    channel: 1,
	    aggregate: 1,
	    autoCount: 1,
	    bin: 1,
	    timeUnit: 1,
	    hasFn: 1,
	    sort: 1,
	    stack: 1,
	    field: 1,
	    type: 1,
	    format: 1,
	    scale: 1,
	    axis: 1,
	    legend: 1,
	    value: 1
	};
	exports.ENCODING_TOPLEVEL_PROPS = util$1.flagKeys(ENCODING_TOPLEVEL_PROP_INDEX);
	function isEncodingTopLevelProperty(p) {
	    return p.toString() in ENCODING_TOPLEVEL_PROP_INDEX;
	}
	exports.isEncodingTopLevelProperty = isEncodingTopLevelProperty;
	const ENCODING_NESTED_PROP_PARENT_INDEX = {
	    bin: 1,
	    scale: 1,
	    sort: 1,
	    axis: 1,
	    legend: 1
	};
	function isEncodingNestedParent(prop) {
	    return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
	}
	exports.isEncodingNestedParent = isEncodingNestedParent;
	// FIXME -- we should not have to manually specify these
	exports.BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
	exports.SORT_CHILD_PROPS = ['field', 'op', 'order'];
	const BIN_PROPS = exports.BIN_CHILD_PROPS.map((c) => {
	    return { parent: 'bin', child: c };
	});
	exports.SORT_PROPS = exports.SORT_CHILD_PROPS.map((c) => {
	    return { parent: 'sort', child: c };
	});
	exports.SCALE_PROPS = scale_1.SCALE_PROPERTIES.map((c) => {
	    return { parent: 'scale', child: c };
	});
	const AXIS_PROPS = axis_1.AXIS_PROPERTIES.map((c) => {
	    return { parent: 'axis', child: c };
	});
	const LEGEND_PROPS = legend_1.LEGEND_PROPERTIES.map((c) => {
	    return { parent: 'legend', child: c };
	});
	exports.ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, exports.SORT_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
	exports.VIEW_PROPS = ['width', 'height', 'background', 'padding', 'title'];
	const PROP_KEY_DELIMITER = '.';
	function toKey(p) {
	    if (isEncodingNestedProp(p)) {
	        return p.parent + PROP_KEY_DELIMITER + p.child;
	    }
	    return p;
	}
	exports.toKey = toKey;
	function fromKey(k) {
	    const split = k.split(PROP_KEY_DELIMITER);
	    /* istanbul ignore else */
	    if (split.length === 1) {
	        return k;
	    }
	    else if (split.length === 2) {
	        return {
	            parent: split[0],
	            child: split[1]
	        };
	    }
	    else {
	        throw `Invalid property key with ${split.length} dots: ${k}`;
	    }
	}
	exports.fromKey = fromKey;
	const ENCODING_NESTED_PROP_INDEX = exports.ENCODING_NESTED_PROPS.reduce((i, prop) => {
	    i[prop.parent] = i[prop.parent] || [];
	    i[prop.parent][prop.child] = prop;
	    return i;
	}, {});
	// FIXME consider using a more general method
	function getEncodingNestedProp(parent, child) {
	    return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
	}
	exports.getEncodingNestedProp = getEncodingNestedProp;
	function isEncodingProperty(p) {
	    return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
	}
	exports.isEncodingProperty = isEncodingProperty;
	exports.ALL_ENCODING_PROPS = [].concat(exports.ENCODING_TOPLEVEL_PROPS, exports.ENCODING_NESTED_PROPS);
	exports.DEFAULT_PROP_PRECEDENCE = [
	    'type',
	    'field',
	    // Field Transform
	    'bin',
	    'timeUnit',
	    'aggregate',
	    'autoCount',
	    // Encoding
	    'channel',
	    // Mark
	    'mark',
	    'stack',
	    'scale',
	    'sort',
	    'axis',
	    'legend'
	].concat(BIN_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, exports.SORT_PROPS);
	var Property;
	(function (Property) {
	    Property.MARK = 'mark';
	    Property.TRANSFORM = 'transform';
	    // Layout
	    Property.STACK = 'stack';
	    Property.FORMAT = 'format';
	    // TODO: sub parts of stack
	    // Encoding Properties
	    Property.CHANNEL = 'channel';
	    Property.AGGREGATE = 'aggregate';
	    Property.AUTOCOUNT = 'autoCount';
	    Property.BIN = 'bin';
	    Property.HAS_FN = 'hasFn';
	    Property.TIMEUNIT = 'timeUnit';
	    Property.FIELD = 'field';
	    Property.TYPE = 'type';
	    Property.SORT = 'sort';
	    Property.SCALE = 'scale';
	    Property.AXIS = 'axis';
	    Property.LEGEND = 'legend';
	    Property.WIDTH = 'width';
	    Property.HEIGHT = 'height';
	    Property.BACKGROUND = 'background';
	    Property.PADDING = 'padding';
	    Property.TITLE = 'title';
	})(Property = exports.Property || (exports.Property = {}));

	});

	/**
	 * All types of primitive marks.
	 */
	const Mark = {
	    arc: 'arc',
	    area: 'area',
	    bar: 'bar',
	    image: 'image',
	    line: 'line',
	    point: 'point',
	    rect: 'rect',
	    rule: 'rule',
	    text: 'text',
	    tick: 'tick',
	    trail: 'trail',
	    circle: 'circle',
	    square: 'square',
	    geoshape: 'geoshape'
	};
	const ARC = Mark.arc;
	const AREA = Mark.area;
	const BAR = Mark.bar;
	const IMAGE = Mark.image;
	const LINE = Mark.line;
	const POINT = Mark.point;
	const RECT = Mark.rect;
	const RULE = Mark.rule;
	const TEXT$1 = Mark.text;
	const TICK = Mark.tick;
	const TRAIL = Mark.trail;
	const CIRCLE = Mark.circle;
	const SQUARE = Mark.square;
	const GEOSHAPE = Mark.geoshape;
	function isMark(m) {
	    return m in Mark;
	}
	function isPathMark(m) {
	    return contains(['line', 'area', 'trail'], m);
	}
	function isRectBasedMark(m) {
	    return contains(['rect', 'bar', 'image', 'arc' /* arc is rect/interval in polar coordinate */], m);
	}
	const PRIMITIVE_MARKS = keys(Mark);
	function isMarkDef(mark) {
	    return mark['type'];
	}
	const PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);
	function isPrimitiveMark(mark) {
	    const markType = isMarkDef(mark) ? mark.type : mark;
	    return markType in PRIMITIVE_MARK_INDEX;
	}
	const STROKE_CONFIG = [
	    'stroke',
	    'strokeWidth',
	    'strokeDash',
	    'strokeDashOffset',
	    'strokeOpacity',
	    'strokeJoin',
	    'strokeMiterLimit'
	];
	const FILL_CONFIG = ['fill', 'fillOpacity'];
	const FILL_STROKE_CONFIG = [...STROKE_CONFIG, ...FILL_CONFIG];
	const VL_ONLY_MARK_CONFIG_INDEX = {
	    color: 1,
	    filled: 1,
	    invalid: 1,
	    order: 1,
	    radius2: 1,
	    theta2: 1,
	    timeUnitBand: 1,
	    timeUnitBandPosition: 1
	};
	const VL_ONLY_MARK_CONFIG_PROPERTIES = keys(VL_ONLY_MARK_CONFIG_INDEX);
	const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
	    area: ['line', 'point'],
	    bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
	    rect: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
	    line: ['point'],
	    tick: ['bandSize', 'thickness']
	};
	const defaultMarkConfig = {
	    color: '#4c78a8',
	    invalid: 'filter',
	    timeUnitBand: 1
	};
	const MARK_CONFIG_INDEX = {
	    mark: 1,
	    arc: 1,
	    area: 1,
	    bar: 1,
	    circle: 1,
	    image: 1,
	    line: 1,
	    point: 1,
	    rect: 1,
	    rule: 1,
	    square: 1,
	    text: 1,
	    tick: 1,
	    trail: 1,
	    geoshape: 1
	};
	const MARK_CONFIGS = keys(MARK_CONFIG_INDEX);
	const BAR_CORNER_RADIUS_INDEX = {
	    horizontal: ['cornerRadiusTopRight', 'cornerRadiusBottomRight'],
	    vertical: ['cornerRadiusTopLeft', 'cornerRadiusTopRight']
	};
	const DEFAULT_RECT_BAND_SIZE = 5;
	const defaultBarConfig = {
	    binSpacing: 1,
	    continuousBandSize: DEFAULT_RECT_BAND_SIZE,
	    timeUnitBandPosition: 0.5
	};
	const defaultRectConfig = {
	    binSpacing: 0,
	    continuousBandSize: DEFAULT_RECT_BAND_SIZE,
	    timeUnitBandPosition: 0.5
	};
	const defaultTickConfig = {
	    thickness: 1
	};
	function getMarkType(m) {
	    return isMarkDef(m) ? m.type : m;
	}

	var mark = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Mark: Mark,
		ARC: ARC,
		AREA: AREA,
		BAR: BAR,
		IMAGE: IMAGE,
		LINE: LINE,
		POINT: POINT,
		RECT: RECT,
		RULE: RULE,
		TEXT: TEXT$1,
		TICK: TICK,
		TRAIL: TRAIL,
		CIRCLE: CIRCLE,
		SQUARE: SQUARE,
		GEOSHAPE: GEOSHAPE,
		isMark: isMark,
		isPathMark: isPathMark,
		isRectBasedMark: isRectBasedMark,
		PRIMITIVE_MARKS: PRIMITIVE_MARKS,
		isMarkDef: isMarkDef,
		isPrimitiveMark: isPrimitiveMark,
		STROKE_CONFIG: STROKE_CONFIG,
		FILL_CONFIG: FILL_CONFIG,
		FILL_STROKE_CONFIG: FILL_STROKE_CONFIG,
		VL_ONLY_MARK_CONFIG_PROPERTIES: VL_ONLY_MARK_CONFIG_PROPERTIES,
		VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX,
		defaultMarkConfig: defaultMarkConfig,
		MARK_CONFIGS: MARK_CONFIGS,
		BAR_CORNER_RADIUS_INDEX: BAR_CORNER_RADIUS_INDEX,
		defaultBarConfig: defaultBarConfig,
		defaultRectConfig: defaultRectConfig,
		defaultTickConfig: defaultTickConfig,
		getMarkType: getMarkType
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(channel);

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(mark);

	var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(type);

	var wildcard = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getDefaultEnumValues = exports.DEFAULT_ENUM_INDEX = exports.getDefaultName = exports.DEFAULT_NAME = exports.initWildcard = exports.isWildcardDef = exports.isShortWildcard = exports.isWildcard = exports.SHORT_WILDCARD = void 0;



	const MARK = __importStar(require$$1);

	const TYPE = __importStar(require$$1$1);


	exports.SHORT_WILDCARD = '?';
	function isWildcard(prop) {
	    return isShortWildcard(prop) || isWildcardDef(prop);
	}
	exports.isWildcard = isWildcard;
	function isShortWildcard(prop) {
	    return prop === exports.SHORT_WILDCARD;
	}
	exports.isShortWildcard = isShortWildcard;
	function isWildcardDef(prop) {
	    return prop !== undefined && prop != null && (!!prop.enum || !!prop.name) && !util$1.isArray(prop);
	}
	exports.isWildcardDef = isWildcardDef;
	function initWildcard(prop, defaultName, defaultEnumValues) {
	    return util$1.extend({}, {
	        name: defaultName,
	        enum: defaultEnumValues
	    }, prop === exports.SHORT_WILDCARD ? {} : prop);
	}
	exports.initWildcard = initWildcard;
	/**
	 * Initial short names from list of full camelCaseNames.
	 * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
	 */
	function initNestedPropName(fullNames) {
	    let index = {};
	    let has = {};
	    for (const fullName of fullNames) {
	        const initialIndices = [0];
	        for (let i = 0; i < fullName.length; i++) {
	            if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
	                initialIndices.push(i);
	            }
	        }
	        let shortName = initialIndices
	            .map(i => fullName.charAt(i))
	            .join('')
	            .toLowerCase();
	        if (!has[shortName]) {
	            index[fullName] = shortName;
	            has[shortName] = true;
	            continue;
	        }
	        // If duplicate, add last character and try again!
	        if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
	            shortName = initialIndices
	                .concat([fullName.length - 1])
	                .map(i => fullName.charAt(i))
	                .join('')
	                .toLowerCase();
	            if (!has[shortName]) {
	                index[fullName] = shortName;
	                has[shortName] = true;
	                continue;
	            }
	        }
	        for (let i = 1; !index[fullName]; i++) {
	            let shortNameWithNo = `${shortName}_${i}`;
	            if (!has[shortNameWithNo]) {
	                index[fullName] = shortNameWithNo;
	                has[shortNameWithNo] = true;
	                break;
	            }
	        }
	    }
	    return index;
	}
	exports.DEFAULT_NAME = {
	    mark: 'm',
	    channel: 'c',
	    aggregate: 'a',
	    autoCount: '#',
	    hasFn: 'h',
	    bin: 'b',
	    sort: 'so',
	    stack: 'st',
	    scale: 's',
	    format: 'f',
	    axis: 'ax',
	    legend: 'l',
	    value: 'v',
	    timeUnit: 'tu',
	    field: 'f',
	    type: 't',
	    binProps: {
	        maxbins: 'mb',
	        min: 'mi',
	        max: 'ma',
	        base: 'b',
	        step: 's',
	        steps: 'ss',
	        minstep: 'ms',
	        divide: 'd'
	    },
	    sortProps: {
	        field: 'f',
	        op: 'o',
	        order: 'or'
	    },
	    scaleProps: initNestedPropName(scale_1.SCALE_PROPERTIES),
	    axisProps: initNestedPropName(axis_1.AXIS_PROPERTIES),
	    legendProps: initNestedPropName(legend_1.LEGEND_PROPERTIES)
	};
	function getDefaultName(prop) {
	    if (property.isEncodingNestedProp(prop)) {
	        return `${exports.DEFAULT_NAME[prop.parent]}-${exports.DEFAULT_NAME[`${prop.parent}Props`][prop.child]}`;
	    }
	    if (exports.DEFAULT_NAME[prop]) {
	        return exports.DEFAULT_NAME[prop];
	    }
	    /* istanbul ignore next */
	    throw new Error(`Default name undefined for ${prop}`);
	}
	exports.getDefaultName = getDefaultName;
	const DEFAULT_BOOLEAN_ENUM = [false, true];
	const DEFAULT_BIN_PROPS_ENUM = {
	    maxbins: [5, 10, 20],
	    extent: [undefined],
	    base: [10],
	    step: [undefined],
	    steps: [undefined],
	    minstep: [undefined],
	    divide: [[5, 2]],
	    binned: [false],
	    anchor: [undefined],
	    nice: [true]
	};
	const DEFAULT_SORT_PROPS = {
	    field: [undefined],
	    op: ['min', 'mean'],
	    order: ['ascending', 'descending']
	};
	const DEFAULT_SCALE_PROPS_ENUM = {
	    align: [undefined],
	    type: [undefined, scale_1.ScaleType.LOG],
	    domain: [undefined],
	    domainMax: [undefined],
	    domainMid: [undefined],
	    domainMin: [undefined],
	    base: [undefined],
	    exponent: [1, 2],
	    constant: [undefined],
	    bins: [undefined],
	    clamp: DEFAULT_BOOLEAN_ENUM,
	    nice: DEFAULT_BOOLEAN_ENUM,
	    reverse: DEFAULT_BOOLEAN_ENUM,
	    round: DEFAULT_BOOLEAN_ENUM,
	    zero: DEFAULT_BOOLEAN_ENUM,
	    padding: [undefined],
	    paddingInner: [undefined],
	    paddingOuter: [undefined],
	    interpolate: [undefined],
	    range: [undefined],
	    rangeMax: [undefined],
	    rangeMin: [undefined],
	    scheme: [undefined]
	};
	const DEFAULT_AXIS_PROPS_ENUM = {
	    aria: [undefined],
	    description: [undefined],
	    zindex: [1, 0],
	    offset: [undefined],
	    orient: [undefined],
	    values: [undefined],
	    bandPosition: [undefined],
	    encoding: [undefined],
	    domain: DEFAULT_BOOLEAN_ENUM,
	    domainCap: [undefined],
	    domainColor: [undefined],
	    domainDash: [undefined],
	    domainDashOffset: [undefined],
	    domainOpacity: [undefined],
	    domainWidth: [undefined],
	    formatType: [undefined],
	    grid: DEFAULT_BOOLEAN_ENUM,
	    gridCap: [undefined],
	    gridColor: [undefined],
	    gridDash: [undefined],
	    gridDashOffset: [undefined],
	    gridOpacity: [undefined],
	    gridWidth: [undefined],
	    format: [undefined],
	    labels: DEFAULT_BOOLEAN_ENUM,
	    labelAlign: [undefined],
	    labelAngle: [undefined],
	    labelBaseline: [undefined],
	    labelColor: [undefined],
	    labelExpr: [undefined],
	    labelFlushOffset: [undefined],
	    labelFont: [undefined],
	    labelFontSize: [undefined],
	    labelFontStyle: [undefined],
	    labelFontWeight: [undefined],
	    labelLimit: [undefined],
	    labelLineHeight: [undefined],
	    labelOffset: [undefined],
	    labelOpacity: [undefined],
	    labelSeparation: [undefined],
	    labelOverlap: [undefined],
	    labelPadding: [undefined],
	    labelBound: [undefined],
	    labelFlush: [undefined],
	    maxExtent: [undefined],
	    minExtent: [undefined],
	    position: [undefined],
	    style: [undefined],
	    ticks: DEFAULT_BOOLEAN_ENUM,
	    tickBand: [undefined],
	    tickCap: [undefined],
	    tickColor: [undefined],
	    tickCount: [undefined],
	    tickDash: [undefined],
	    tickExtra: [undefined],
	    tickDashOffset: [undefined],
	    tickMinStep: [undefined],
	    tickOffset: [undefined],
	    tickOpacity: [undefined],
	    tickRound: [undefined],
	    tickSize: [undefined],
	    tickWidth: [undefined],
	    title: [undefined],
	    titleAlign: [undefined],
	    titleAnchor: [undefined],
	    titleAngle: [undefined],
	    titleBaseline: [undefined],
	    titleColor: [undefined],
	    titleFont: [undefined],
	    titleFontSize: [undefined],
	    titleFontStyle: [undefined],
	    titleFontWeight: [undefined],
	    titleLimit: [undefined],
	    titleLineHeight: [undefined],
	    titleOpacity: [undefined],
	    titlePadding: [undefined],
	    titleX: [undefined],
	    titleY: [undefined],
	    translate: [undefined],
	};
	const DEFAULT_LEGEND_PROPS_ENUM = {
	    aria: [undefined],
	    description: [undefined],
	    orient: ['left', 'right'],
	    format: [undefined],
	    type: [undefined],
	    values: [undefined],
	    zindex: [undefined],
	    clipHeight: [undefined],
	    columnPadding: [undefined],
	    columns: [undefined],
	    cornerRadius: [undefined],
	    direction: [undefined],
	    encoding: [undefined],
	    fillColor: [undefined],
	    formatType: [undefined],
	    gridAlign: [undefined],
	    offset: [undefined],
	    padding: [undefined],
	    rowPadding: [undefined],
	    strokeColor: [undefined],
	    labelAlign: [undefined],
	    labelBaseline: [undefined],
	    labelColor: [undefined],
	    labelExpr: [undefined],
	    labelFont: [undefined],
	    labelFontSize: [undefined],
	    labelFontStyle: [undefined],
	    labelFontWeight: [undefined],
	    labelLimit: [undefined],
	    labelOffset: [undefined],
	    labelOpacity: [undefined],
	    labelOverlap: [undefined],
	    labelPadding: [undefined],
	    labelSeparation: [undefined],
	    legendX: [undefined],
	    legendY: [undefined],
	    gradientLength: [undefined],
	    gradientOpacity: [undefined],
	    gradientStrokeColor: [undefined],
	    gradientStrokeWidth: [undefined],
	    gradientThickness: [undefined],
	    symbolDash: [undefined],
	    symbolDashOffset: [undefined],
	    symbolFillColor: [undefined],
	    symbolLimit: [undefined],
	    symbolOffset: [undefined],
	    symbolOpacity: [undefined],
	    symbolSize: [undefined],
	    symbolStrokeColor: [undefined],
	    symbolStrokeWidth: [undefined],
	    symbolType: [undefined],
	    tickCount: [undefined],
	    tickMinStep: [undefined],
	    title: [undefined],
	    titleAnchor: [undefined],
	    titleAlign: [undefined],
	    titleBaseline: [undefined],
	    titleColor: [undefined],
	    titleFont: [undefined],
	    titleFontSize: [undefined],
	    titleFontStyle: [undefined],
	    titleFontWeight: [undefined],
	    titleLimit: [undefined],
	    titleLineHeight: [undefined],
	    titleOpacity: [undefined],
	    titleOrient: [undefined],
	    titlePadding: [undefined],
	};
	// Use FullEnumIndex to make sure we have all properties specified here!
	exports.DEFAULT_ENUM_INDEX = {
	    mark: [MARK.POINT, MARK.BAR, MARK.LINE, MARK.AREA, MARK.RECT, MARK.TICK, MARK.TEXT],
	    channel: [require$$0.X, require$$0.Y, require$$0.ROW, require$$0.COLUMN, require$$0.SIZE, require$$0.COLOR],
	    band: [undefined],
	    aggregate: [undefined, 'mean'],
	    autoCount: DEFAULT_BOOLEAN_ENUM,
	    bin: DEFAULT_BOOLEAN_ENUM,
	    hasFn: DEFAULT_BOOLEAN_ENUM,
	    timeUnit: [undefined, "year", "month", "minutes", "seconds"],
	    field: [undefined],
	    type: [TYPE.NOMINAL, TYPE.ORDINAL, TYPE.QUANTITATIVE, TYPE.TEMPORAL],
	    sort: ['ascending', 'descending'],
	    stack: ['zero', 'normalize', 'center', null],
	    value: [undefined],
	    format: [undefined],
	    title: [undefined],
	    scale: [true],
	    axis: DEFAULT_BOOLEAN_ENUM,
	    legend: DEFAULT_BOOLEAN_ENUM,
	    binProps: DEFAULT_BIN_PROPS_ENUM,
	    sortProps: DEFAULT_SORT_PROPS,
	    scaleProps: DEFAULT_SCALE_PROPS_ENUM,
	    axisProps: DEFAULT_AXIS_PROPS_ENUM,
	    legendProps: DEFAULT_LEGEND_PROPS_ENUM
	};
	// TODO: rename this to getDefaultEnum
	function getDefaultEnumValues(prop, schema, opt) {
	    if (prop === 'field' || (property.isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
	        // For field, by default enumerate all fields
	        return schema.fieldNames();
	    }
	    let val;
	    if (property.isEncodingNestedProp(prop)) {
	        val = opt.enum[`${prop.parent}Props`][prop.child];
	    }
	    else {
	        val = opt.enum[prop];
	    }
	    if (val !== undefined) {
	        return val;
	    }
	    /* istanbul ignore next */
	    throw new Error(`No default enumValues for ${JSON.stringify(prop)}`);
	}
	exports.getDefaultEnumValues = getDefaultEnumValues;

	});

	var config = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendConfig = exports.DEFAULT_QUERY_CONFIG = void 0;
	const CHANNEL = __importStar(require$$0);


	exports.DEFAULT_QUERY_CONFIG = {
	    verbose: false,
	    defaultSpecConfig: {
	        line: { point: true },
	        scale: { useUnaggregatedDomain: true }
	    },
	    propertyPrecedence: property.DEFAULT_PROP_PRECEDENCE.map(property.toKey),
	    enum: wildcard.DEFAULT_ENUM_INDEX,
	    numberNominalProportion: 0.05,
	    numberNominalLimit: 40,
	    // CONSTRAINTS
	    constraintManuallySpecifiedValue: false,
	    // Spec Constraints -- See description inside src/constraints/spec.ts
	    autoAddCount: false,
	    hasAppropriateGraphicTypeForMark: true,
	    omitAggregate: false,
	    omitAggregatePlotWithDimensionOnlyOnFacet: true,
	    omitAggregatePlotWithoutDimension: false,
	    omitBarLineAreaWithOcclusion: true,
	    omitBarTickWithSize: true,
	    omitMultipleNonPositionalChannels: true,
	    omitRaw: false,
	    omitRawContinuousFieldForAggregatePlot: true,
	    omitRepeatedField: true,
	    omitNonPositionalOrFacetOverPositionalChannels: true,
	    omitTableWithOcclusionIfAutoAddCount: true,
	    omitVerticalDotPlot: false,
	    omitInvalidStackSpec: true,
	    omitNonSumStack: true,
	    preferredBinAxis: CHANNEL.X,
	    preferredTemporalAxis: CHANNEL.X,
	    preferredOrdinalAxis: CHANNEL.Y,
	    preferredNominalAxis: CHANNEL.Y,
	    preferredFacet: CHANNEL.ROW,
	    // Field Encoding Constraints -- See description inside src/constraint/field.ts
	    minCardinalityForBin: 15,
	    maxCardinalityForCategoricalColor: 20,
	    maxCardinalityForFacet: 20,
	    maxCardinalityForShape: 6,
	    timeUnitShouldHaveVariation: true,
	    typeMatchesSchemaType: true,
	    // STYLIZE
	    stylize: true,
	    smallRangeStepForHighCardinalityOrFacet: { maxCardinality: 10, rangeStep: 12 },
	    nominalColorScaleForHighCardinality: { maxCardinality: 10, palette: 'category20' },
	    xAxisOnTopForHighYCardinalityWithoutColumn: { maxCardinality: 30 },
	    // RANKING PREFERENCE
	    maxGoodCardinalityForFacet: 5,
	    maxGoodCardinalityForColor: 7,
	    // HIGH CARDINALITY STRINGS
	    minPercentUniqueForKey: 0.8,
	    minCardinalityForKey: 50
	};
	function extendConfig(opt) {
	    return Object.assign(Object.assign(Object.assign({}, exports.DEFAULT_QUERY_CONFIG), opt), { enum: extendEnumIndex(opt.enum) });
	}
	exports.extendConfig = extendConfig;
	function extendEnumIndex(enumIndex) {
	    const enumOpt = Object.assign(Object.assign(Object.assign({}, wildcard.DEFAULT_ENUM_INDEX), enumIndex), { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
	    return enumOpt;
	}
	function extendNestedEnumIndex(enumIndex, prop) {
	    return Object.assign(Object.assign({}, wildcard.DEFAULT_ENUM_INDEX[`${prop}Props`]), enumIndex[`${prop}Props`]);
	}

	});

	const AGGREGATE_OP_INDEX = {
	    argmax: 1,
	    argmin: 1,
	    average: 1,
	    count: 1,
	    distinct: 1,
	    product: 1,
	    max: 1,
	    mean: 1,
	    median: 1,
	    min: 1,
	    missing: 1,
	    q1: 1,
	    q3: 1,
	    ci0: 1,
	    ci1: 1,
	    stderr: 1,
	    stdev: 1,
	    stdevp: 1,
	    sum: 1,
	    valid: 1,
	    values: 1,
	    variance: 1,
	    variancep: 1
	};
	const MULTIDOMAIN_SORT_OP_INDEX = {
	    count: 1,
	    min: 1,
	    max: 1
	};
	function isArgminDef(a) {
	    return !!a && !!a['argmin'];
	}
	function isArgmaxDef(a) {
	    return !!a && !!a['argmax'];
	}
	const AGGREGATE_OPS = keys(AGGREGATE_OP_INDEX);
	function isAggregateOp(a) {
	    return isString(a) && !!AGGREGATE_OP_INDEX[a];
	}
	const COUNTING_OPS = ['count', 'valid', 'missing', 'distinct'];
	function isCountingAggregateOp(aggregate) {
	    return isString(aggregate) && contains(COUNTING_OPS, aggregate);
	}
	function isMinMaxOp(aggregate) {
	    return isString(aggregate) && contains(['min', 'max'], aggregate);
	}
	/** Additive-based aggregation operations. These can be applied to stack. */
	const SUM_OPS = ['count', 'sum', 'distinct', 'valid', 'missing'];
	/**
	 * Aggregation operators that always produce values within the range [domainMin, domainMax].
	 */
	const SHARED_DOMAIN_OPS = ['mean', 'average', 'median', 'q1', 'q3', 'min', 'max'];
	const SHARED_DOMAIN_OP_INDEX = toSet(SHARED_DOMAIN_OPS);

	var aggregate = /*#__PURE__*/Object.freeze({
		__proto__: null,
		MULTIDOMAIN_SORT_OP_INDEX: MULTIDOMAIN_SORT_OP_INDEX,
		isArgminDef: isArgminDef,
		isArgmaxDef: isArgmaxDef,
		AGGREGATE_OPS: AGGREGATE_OPS,
		isAggregateOp: isAggregateOp,
		COUNTING_OPS: COUNTING_OPS,
		isCountingAggregateOp: isCountingAggregateOp,
		isMinMaxOp: isMinMaxOp,
		SUM_OPS: SUM_OPS,
		SHARED_DOMAIN_OPS: SHARED_DOMAIN_OPS,
		SHARED_DOMAIN_OP_INDEX: SHARED_DOMAIN_OP_INDEX
	});

	/**
	 * Create a key for the bin configuration. Not for prebinned bin.
	 */
	function binToString(bin) {
	    if (isBoolean(bin)) {
	        bin = normalizeBin(bin, undefined);
	    }
	    return ('bin' +
	        keys(bin)
	            .map(p => (isSelectionExtent(bin[p]) ? varName(`_${p}_${entries(bin[p])}`) : varName(`_${p}_${bin[p]}`)))
	            .join(''));
	}
	/**
	 * Vega-Lite should bin the data.
	 */
	function isBinning(bin) {
	    return bin === true || (isBinParams(bin) && !bin.binned);
	}
	/**
	 * The data is already binned and so Vega-Lite should not bin it again.
	 */
	function isBinned(bin) {
	    return bin === 'binned' || (isBinParams(bin) && bin.binned === true);
	}
	function isBinParams(bin) {
	    return isObject(bin);
	}
	function isSelectionExtent(extent) {
	    return extent === null || extent === void 0 ? void 0 : extent['selection'];
	}
	function autoMaxBins(channel) {
	    switch (channel) {
	        case ROW:
	        case COLUMN:
	        case SIZE:
	        case COLOR:
	        case FILL:
	        case STROKE:
	        case STROKEWIDTH:
	        case OPACITY:
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        // Facets and Size shouldn't have too many bins
	        // We choose 6 like shape to simplify the rule [falls through]
	        case SHAPE:
	            return 6; // Vega's "shape" has 6 distinct values
	        case STROKEDASH:
	            return 4; // We only provide 5 different stroke dash values (but 4 is more effective)
	        default:
	            return 10;
	    }
	}

	var bin = /*#__PURE__*/Object.freeze({
		__proto__: null,
		binToString: binToString,
		isBinning: isBinning,
		isBinned: isBinned,
		isBinParams: isBinParams,
		isSelectionExtent: isSelectionExtent,
		autoMaxBins: autoMaxBins
	});

	function isSignalRef(o) {
	    return o && !!o['signal'];
	}

	function isExprRef(o) {
	    return o && !!o['expr'];
	}

	var __rest$2 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};

	var __rest$3 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	function getStyles(mark) {
	    var _a;
	    return [].concat(mark.type, (_a = mark.style) !== null && _a !== void 0 ? _a : []);
	}
	/**
	 * Return property value from style or mark specific config property if exists.
	 * Otherwise, return general mark specific config.
	 */
	function getMarkConfig(channel, mark, config, { vgChannel } = {}) {
	    return getFirstDefined(
	    // style config has highest precedence
	    vgChannel ? getMarkStyleConfig(channel, mark, config.style) : undefined, getMarkStyleConfig(channel, mark, config.style), 
	    // then mark-specific config
	    vgChannel ? config[mark.type][vgChannel] : undefined, config[mark.type][channel], // Need to cast because MarkDef doesn't perfectly match with AnyMarkConfig, but if the type isn't available, we'll get nothing here, which is fine
	    // If there is vgChannel, skip vl channel.
	    // For example, vl size for text is vg fontSize, but config.mark.size is only for point size.
	    vgChannel ? config.mark[vgChannel] : config.mark[channel] // Need to cast for the same reason as above
	    );
	}
	function getMarkStyleConfig(prop, mark, styleConfigIndex) {
	    return getStyleConfig(prop, getStyles(mark), styleConfigIndex);
	}
	function getStyleConfig(p, styles, styleConfigIndex) {
	    styles = array(styles);
	    let value;
	    for (const style of styles) {
	        const styleConfig = styleConfigIndex[style];
	        if (styleConfig && styleConfig[p] !== undefined) {
	            value = styleConfig[p];
	        }
	    }
	    return value;
	}

	// DateTime definition object
	function isDateTime(o) {
	    if (o && isObject(o)) {
	        for (const part of TIMEUNIT_PARTS) {
	            if (part in o) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	const MONTHS = [
	    'january',
	    'february',
	    'march',
	    'april',
	    'may',
	    'june',
	    'july',
	    'august',
	    'september',
	    'october',
	    'november',
	    'december'
	];
	const SHORT_MONTHS = MONTHS.map(m => m.substr(0, 3));
	const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const SHORT_DAYS = DAYS.map(d => d.substr(0, 3));
	function normalizeQuarter(q) {
	    if (isNumeric(q)) {
	        q = +q;
	    }
	    if (isNumber(q)) {
	        if (q > 4) {
	            warn(invalidTimeUnit('quarter', q));
	        }
	        // We accept 1-based quarter, so need to readjust to 0-based quarter
	        return q - 1;
	    }
	    else {
	        // Invalid quarter
	        throw new Error(invalidTimeUnit('quarter', q));
	    }
	}
	function normalizeMonth(m) {
	    if (isNumeric(m)) {
	        m = +m;
	    }
	    if (isNumber(m)) {
	        // We accept 1-based month, so need to readjust to 0-based month
	        return m - 1;
	    }
	    else {
	        const lowerM = m.toLowerCase();
	        const monthIndex = MONTHS.indexOf(lowerM);
	        if (monthIndex !== -1) {
	            return monthIndex; // 0 for january, ...
	        }
	        const shortM = lowerM.substr(0, 3);
	        const shortMonthIndex = SHORT_MONTHS.indexOf(shortM);
	        if (shortMonthIndex !== -1) {
	            return shortMonthIndex;
	        }
	        // Invalid month
	        throw new Error(invalidTimeUnit('month', m));
	    }
	}
	function normalizeDay(d) {
	    if (isNumeric(d)) {
	        d = +d;
	    }
	    if (isNumber(d)) {
	        // mod so that this can be both 0-based where 0 = sunday
	        // and 1-based where 7=sunday
	        return d % 7;
	    }
	    else {
	        const lowerD = d.toLowerCase();
	        const dayIndex = DAYS.indexOf(lowerD);
	        if (dayIndex !== -1) {
	            return dayIndex; // 0 for january, ...
	        }
	        const shortD = lowerD.substr(0, 3);
	        const shortDayIndex = SHORT_DAYS.indexOf(shortD);
	        if (shortDayIndex !== -1) {
	            return shortDayIndex;
	        }
	        // Invalid day
	        throw new Error(invalidTimeUnit('day', d));
	    }
	}
	/**
	 * @param d the date.
	 * @param normalize whether to normalize quarter, month, day. This should probably be true if d is a DateTime.
	 * @returns array of date time parts [year, month, day, hours, minutes, seconds, milliseconds]
	 */
	function dateTimeParts(d, normalize) {
	    const parts = [];
	    if (normalize && d.day !== undefined) {
	        if (keys(d).length > 1) {
	            warn(droppedDay(d));
	            d = duplicate(d);
	            delete d.day;
	        }
	    }
	    if (d.year !== undefined) {
	        parts.push(d.year);
	    }
	    else {
	        // Just like Vega's timeunit transform, set default year to 2012, so domain conversion will be compatible with Vega
	        // Note: 2012 is a leap year (and so the date February 29 is respected) that begins on a Sunday (and so days of the week will order properly at the beginning of the year).
	        parts.push(2012);
	    }
	    if (d.month !== undefined) {
	        const month = normalize ? normalizeMonth(d.month) : d.month;
	        parts.push(month);
	    }
	    else if (d.quarter !== undefined) {
	        const quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
	        parts.push(isNumber(quarter) ? quarter * 3 : quarter + '*3');
	    }
	    else {
	        parts.push(0); // months start at zero in JS
	    }
	    if (d.date !== undefined) {
	        parts.push(d.date);
	    }
	    else if (d.day !== undefined) {
	        // HACK: Day only works as a standalone unit
	        // This is only correct because we always set year to 2006 for day
	        const day = normalize ? normalizeDay(d.day) : d.day;
	        parts.push(isNumber(day) ? day + 1 : day + '+1');
	    }
	    else {
	        parts.push(1); // Date starts at 1 in JS
	    }
	    // Note: can't use TimeUnit enum here as importing it will create
	    // circular dependency problem!
	    for (const timeUnit of ['hours', 'minutes', 'seconds', 'milliseconds']) {
	        const unit = d[timeUnit];
	        parts.push(typeof unit === 'undefined' ? 0 : unit);
	    }
	    return parts;
	}
	/**
	 * Return Vega expression for a date time.
	 *
	 * @param d the date time.
	 * @returns the Vega expression.
	 */
	function dateTimeToExpr(d) {
	    const parts = dateTimeParts(d, true);
	    const string = parts.join(', ');
	    if (d.utc) {
	        return `utc(${string})`;
	    }
	    else {
	        return `datetime(${string})`;
	    }
	}
	/**
	 * Return Vega expression for a date time expression.
	 *
	 * @param d the internal date time object with expression.
	 * @returns the Vega expression.
	 */
	function dateTimeExprToExpr(d) {
	    const parts = dateTimeParts(d, false);
	    const string = parts.join(', ');
	    if (d.utc) {
	        return `utc(${string})`;
	    }
	    else {
	        return `datetime(${string})`;
	    }
	}

	var __rest$4 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	/** Time Unit that only corresponds to only one part of Date objects. */
	const LOCAL_SINGLE_TIMEUNIT_INDEX = {
	    year: 1,
	    quarter: 1,
	    month: 1,
	    week: 1,
	    day: 1,
	    dayofyear: 1,
	    date: 1,
	    hours: 1,
	    minutes: 1,
	    seconds: 1,
	    milliseconds: 1
	};
	const TIMEUNIT_PARTS = keys(LOCAL_SINGLE_TIMEUNIT_INDEX);
	function isLocalSingleTimeUnit(timeUnit) {
	    return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
	}
	const UTC_SINGLE_TIMEUNIT_INDEX = {
	    utcyear: 1,
	    utcquarter: 1,
	    utcmonth: 1,
	    utcweek: 1,
	    utcday: 1,
	    utcdayofyear: 1,
	    utcdate: 1,
	    utchours: 1,
	    utcminutes: 1,
	    utcseconds: 1,
	    utcmilliseconds: 1
	};
	const LOCAL_MULTI_TIMEUNIT_INDEX = {
	    yearquarter: 1,
	    yearquartermonth: 1,
	    yearmonth: 1,
	    yearmonthdate: 1,
	    yearmonthdatehours: 1,
	    yearmonthdatehoursminutes: 1,
	    yearmonthdatehoursminutesseconds: 1,
	    yearweek: 1,
	    yearweekday: 1,
	    yearweekdayhours: 1,
	    yearweekdayhoursminutes: 1,
	    yearweekdayhoursminutesseconds: 1,
	    yeardayofyear: 1,
	    quartermonth: 1,
	    monthdate: 1,
	    monthdatehours: 1,
	    monthdatehoursminutes: 1,
	    monthdatehoursminutesseconds: 1,
	    weekday: 1,
	    weeksdayhours: 1,
	    weekdayhoursminutes: 1,
	    weekdayhoursminutesseconds: 1,
	    dayhours: 1,
	    dayhoursminutes: 1,
	    dayhoursminutesseconds: 1,
	    hoursminutes: 1,
	    hoursminutesseconds: 1,
	    minutesseconds: 1,
	    secondsmilliseconds: 1
	};
	const UTC_MULTI_TIMEUNIT_INDEX = {
	    utcyearquarter: 1,
	    utcyearquartermonth: 1,
	    utcyearmonth: 1,
	    utcyearmonthdate: 1,
	    utcyearmonthdatehours: 1,
	    utcyearmonthdatehoursminutes: 1,
	    utcyearmonthdatehoursminutesseconds: 1,
	    utcyearweek: 1,
	    utcyearweekday: 1,
	    utcyearweekdayhours: 1,
	    utcyearweekdayhoursminutes: 1,
	    utcyearweekdayhoursminutesseconds: 1,
	    utcyeardayofyear: 1,
	    utcquartermonth: 1,
	    utcmonthdate: 1,
	    utcmonthdatehours: 1,
	    utcmonthdatehoursminutes: 1,
	    utcmonthdatehoursminutesseconds: 1,
	    utcweekday: 1,
	    utcweeksdayhours: 1,
	    utcweekdayhoursminutes: 1,
	    utcweekdayhoursminutesseconds: 1,
	    utcdayhours: 1,
	    utcdayhoursminutes: 1,
	    utcdayhoursminutesseconds: 1,
	    utchoursminutes: 1,
	    utchoursminutesseconds: 1,
	    utcminutesseconds: 1,
	    utcsecondsmilliseconds: 1
	};
	function isUTCTimeUnit(t) {
	    return t.startsWith('utc');
	}
	function getLocalTimeUnit(t) {
	    return t.substr(3);
	}
	// In order of increasing specificity
	const VEGALITE_TIMEFORMAT = {
	    'year-month': '%b %Y ',
	    'year-month-date': '%b %d, %Y '
	};
	function getTimeUnitParts(timeUnit) {
	    const parts = [];
	    for (const part of TIMEUNIT_PARTS) {
	        if (containsTimeUnit(timeUnit, part)) {
	            parts.push(part);
	        }
	    }
	    return parts;
	}
	/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
	function containsTimeUnit(fullTimeUnit, timeUnit) {
	    const index = fullTimeUnit.indexOf(timeUnit);
	    if (index < 0) {
	        return false;
	    }
	    // exclude milliseconds
	    if (index > 0 && timeUnit === 'seconds' && fullTimeUnit.charAt(index - 1) === 'i') {
	        return false;
	    }
	    // exclude dayofyear
	    if (fullTimeUnit.length > index + 3 && timeUnit === 'day' && fullTimeUnit.charAt(index + 3) === 'o') {
	        return false;
	    }
	    if (index > 0 && timeUnit === 'year' && fullTimeUnit.charAt(index - 1) === 'f') {
	        return false;
	    }
	    return true;
	}
	/**
	 * Returns Vega expression for a given timeUnit and fieldRef
	 */
	function fieldExpr(fullTimeUnit, field, { end } = { end: false }) {
	    const fieldRef = accessPathWithDatum(field);
	    const utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';
	    function func(timeUnit) {
	        if (timeUnit === 'quarter') {
	            // quarter starting at 0 (0,3,6,9).
	            return `(${utc}quarter(${fieldRef})-1)`;
	        }
	        else {
	            return `${utc}${timeUnit}(${fieldRef})`;
	        }
	    }
	    let lastTimeUnit;
	    const dateExpr = {};
	    for (const part of TIMEUNIT_PARTS) {
	        if (containsTimeUnit(fullTimeUnit, part)) {
	            dateExpr[part] = func(part);
	            lastTimeUnit = part;
	        }
	    }
	    if (end) {
	        dateExpr[lastTimeUnit] += '+1';
	    }
	    return dateTimeExprToExpr(dateExpr);
	}
	function timeUnitSpecifierExpression(timeUnit) {
	    if (!timeUnit) {
	        return undefined;
	    }
	    const timeUnitParts = getTimeUnitParts(timeUnit);
	    return `timeUnitSpecifier(${fastJsonStableStringify(timeUnitParts)}, ${fastJsonStableStringify(VEGALITE_TIMEFORMAT)})`;
	}
	/**
	 * Returns the signal expression used for axis labels for a time unit.
	 */
	function formatExpression(timeUnit, field, isUTCScale) {
	    if (!timeUnit) {
	        return undefined;
	    }
	    const expr = timeUnitSpecifierExpression(timeUnit);
	    // We only use utcFormat for utc scale
	    // For utc time units, the data is already converted as a part of timeUnit transform.
	    // Thus, utc time units should use timeFormat to avoid shifting the time twice.
	    const utc = isUTCScale || isUTCTimeUnit(timeUnit);
	    return `${utc ? 'utc' : 'time'}Format(${field}, ${expr})`;
	}
	function normalizeTimeUnit(timeUnit) {
	    if (!timeUnit) {
	        return undefined;
	    }
	    let params;
	    if (isString(timeUnit)) {
	        params = {
	            unit: timeUnit
	        };
	    }
	    else if (isObject(timeUnit)) {
	        params = Object.assign(Object.assign({}, timeUnit), (timeUnit.unit ? { unit: timeUnit.unit } : {}));
	    }
	    if (isUTCTimeUnit(params.unit)) {
	        params.utc = true;
	        params.unit = getLocalTimeUnit(params.unit);
	    }
	    return params;
	}
	function timeUnitToString(tu) {
	    const _a = normalizeTimeUnit(tu), { utc } = _a, rest = __rest$4(_a, ["utc"]);
	    if (rest.unit) {
	        return ((utc ? 'utc' : '') +
	            keys(rest)
	                .map(p => varName(`${p === 'unit' ? '' : `_${p}_`}${rest[p]}`))
	                .join(''));
	    }
	    else {
	        // when maxbins is specified instead of units
	        return ((utc ? 'utc' : '') +
	            'timeunit' +
	            keys(rest)
	                .map(p => varName(`_${p}_${rest[p]}`))
	                .join(''));
	    }
	}

	var timeunit = /*#__PURE__*/Object.freeze({
		__proto__: null,
		LOCAL_SINGLE_TIMEUNIT_INDEX: LOCAL_SINGLE_TIMEUNIT_INDEX,
		TIMEUNIT_PARTS: TIMEUNIT_PARTS,
		isLocalSingleTimeUnit: isLocalSingleTimeUnit,
		UTC_SINGLE_TIMEUNIT_INDEX: UTC_SINGLE_TIMEUNIT_INDEX,
		LOCAL_MULTI_TIMEUNIT_INDEX: LOCAL_MULTI_TIMEUNIT_INDEX,
		UTC_MULTI_TIMEUNIT_INDEX: UTC_MULTI_TIMEUNIT_INDEX,
		isUTCTimeUnit: isUTCTimeUnit,
		getLocalTimeUnit: getLocalTimeUnit,
		VEGALITE_TIMEFORMAT: VEGALITE_TIMEFORMAT,
		getTimeUnitParts: getTimeUnitParts,
		containsTimeUnit: containsTimeUnit,
		fieldExpr: fieldExpr,
		timeUnitSpecifierExpression: timeUnitSpecifierExpression,
		formatExpression: formatExpression,
		normalizeTimeUnit: normalizeTimeUnit,
		timeUnitToString: timeUnitToString
	});

	function isCustomFormatType(formatType) {
	    return formatType && formatType !== 'number' && formatType !== 'time';
	}

	const SORT_BY_CHANNEL_INDEX = {
	    x: 1,
	    y: 1,
	    color: 1,
	    fill: 1,
	    stroke: 1,
	    strokeWidth: 1,
	    size: 1,
	    shape: 1,
	    fillOpacity: 1,
	    strokeOpacity: 1,
	    opacity: 1,
	    text: 1
	};
	function isSortByChannel(c) {
	    return c in SORT_BY_CHANNEL_INDEX;
	}

	function isFacetFieldDef(channelDef) {
	    return !!channelDef && 'header' in channelDef;
	}

	var __rest$5 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	function isConditionalSelection(c) {
	    return c['selection'];
	}
	function isRepeatRef(field) {
	    return field && !isString(field) && 'repeat' in field;
	}
	function toFieldDefBase(fieldDef) {
	    const { field, timeUnit, bin, aggregate } = fieldDef;
	    return Object.assign(Object.assign(Object.assign(Object.assign({}, (timeUnit ? { timeUnit } : {})), (bin ? { bin } : {})), (aggregate ? { aggregate } : {})), { field });
	}
	function isSortableFieldDef(fieldDef) {
	    return 'sort' in fieldDef;
	}
	function getBand({ channel, fieldDef, fieldDef2, markDef: mark, stack, config, isMidPoint }) {
	    if (isFieldOrDatumDef(fieldDef) && fieldDef.band !== undefined) {
	        return fieldDef.band;
	    }
	    if (isFieldDef(fieldDef)) {
	        const { timeUnit, bin } = fieldDef;
	        if (timeUnit && !fieldDef2) {
	            if (isMidPoint) {
	                return getMarkConfig('timeUnitBandPosition', mark, config);
	            }
	            else {
	                return isRectBasedMark(mark.type) ? getMarkConfig('timeUnitBand', mark, config) : 0;
	            }
	        }
	        else if (isBinning(bin)) {
	            return isRectBasedMark(mark.type) && !isMidPoint ? 1 : 0.5;
	        }
	    }
	    if ((stack === null || stack === void 0 ? void 0 : stack.fieldChannel) === channel && isMidPoint) {
	        return 0.5;
	    }
	    return undefined;
	}
	function hasBand(channel, fieldDef, fieldDef2, stack, markDef, config) {
	    if (isBinning(fieldDef.bin) || (fieldDef.timeUnit && isTypedFieldDef(fieldDef) && fieldDef.type === 'temporal')) {
	        return !!getBand({ channel, fieldDef, fieldDef2, stack, markDef, config });
	    }
	    return false;
	}
	function isConditionalDef(channelDef) {
	    return !!channelDef && 'condition' in channelDef;
	}
	/**
	 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
	 */
	function hasConditionalFieldDef(channelDef) {
	    const condition = channelDef && channelDef['condition'];
	    return !!condition && !isArray(condition) && isFieldDef(condition);
	}
	function hasConditionalFieldOrDatumDef(channelDef) {
	    const condition = channelDef && channelDef['condition'];
	    return !!condition && !isArray(condition) && isFieldOrDatumDef(condition);
	}
	function hasConditionalValueDef(channelDef) {
	    const condition = channelDef && channelDef['condition'];
	    return !!condition && (isArray(condition) || isValueDef(condition));
	}
	function isFieldDef(channelDef) {
	    // TODO: we can't use field in channelDef here as it's somehow failing runtime test
	    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
	}
	function channelDefType(channelDef) {
	    return channelDef && channelDef['type'];
	}
	function isDatumDef(channelDef) {
	    return !!channelDef && 'datum' in channelDef;
	}
	function isContinuousFieldOrDatumDef(cd) {
	    // TODO: make datum support DateTime object
	    return (isTypedFieldDef(cd) && isContinuous(cd)) || isNumericDataDef(cd);
	}
	function isQuantitativeFieldOrDatumDef(cd) {
	    // TODO: make datum support DateTime object
	    return channelDefType(cd) === 'quantitative' || isNumericDataDef(cd);
	}
	function isNumericDataDef(cd) {
	    return isDatumDef(cd) && isNumber(cd.datum);
	}
	function isFieldOrDatumDef(channelDef) {
	    return isFieldDef(channelDef) || isDatumDef(channelDef);
	}
	function isTypedFieldDef(channelDef) {
	    return !!channelDef && ('field' in channelDef || channelDef['aggregate'] === 'count') && 'type' in channelDef;
	}
	function isValueDef(channelDef) {
	    return channelDef && 'value' in channelDef && 'value' in channelDef;
	}
	function isScaleFieldDef(channelDef) {
	    return !!channelDef && ('scale' in channelDef || 'sort' in channelDef);
	}
	function isPositionFieldOrDatumDef(channelDef) {
	    return channelDef && ('axis' in channelDef || 'stack' in channelDef || 'impute' in channelDef);
	}
	function isMarkPropFieldOrDatumDef(channelDef) {
	    return !!channelDef && 'legend' in channelDef;
	}
	function isStringFieldOrDatumDef(channelDef) {
	    return !!channelDef && ('format' in channelDef || 'formatType' in channelDef);
	}
	function toStringFieldDef(fieldDef) {
	    // omit properties that don't exist in string field defs
	    return omit(fieldDef, ['legend', 'axis', 'header', 'scale']);
	}
	function isOpFieldDef(fieldDef) {
	    return 'op' in fieldDef;
	}
	/**
	 * Get a Vega field reference from a Vega-Lite field def.
	 */
	function vgField(fieldDef, opt = {}) {
	    var _a, _b, _c;
	    let field = fieldDef.field;
	    const prefix = opt.prefix;
	    let suffix = opt.suffix;
	    let argAccessor = ''; // for accessing argmin/argmax field at the end without getting escaped
	    if (isCount(fieldDef)) {
	        field = internalField('count');
	    }
	    else {
	        let fn;
	        if (!opt.nofn) {
	            if (isOpFieldDef(fieldDef)) {
	                fn = fieldDef.op;
	            }
	            else {
	                const { bin, aggregate, timeUnit } = fieldDef;
	                if (isBinning(bin)) {
	                    fn = binToString(bin);
	                    suffix = ((_a = opt.binSuffix) !== null && _a !== void 0 ? _a : '') + ((_b = opt.suffix) !== null && _b !== void 0 ? _b : '');
	                }
	                else if (aggregate) {
	                    if (isArgmaxDef(aggregate)) {
	                        argAccessor = `["${field}"]`;
	                        field = `argmax_${aggregate.argmax}`;
	                    }
	                    else if (isArgminDef(aggregate)) {
	                        argAccessor = `["${field}"]`;
	                        field = `argmin_${aggregate.argmin}`;
	                    }
	                    else {
	                        fn = String(aggregate);
	                    }
	                }
	                else if (timeUnit) {
	                    fn = timeUnitToString(timeUnit);
	                    suffix = ((!contains(['range', 'mid'], opt.binSuffix) && opt.binSuffix) || '') + ((_c = opt.suffix) !== null && _c !== void 0 ? _c : '');
	                }
	            }
	        }
	        if (fn) {
	            field = field ? `${fn}_${field}` : fn;
	        }
	    }
	    if (suffix) {
	        field = `${field}_${suffix}`;
	    }
	    if (prefix) {
	        field = `${prefix}_${field}`;
	    }
	    if (opt.forAs) {
	        return removePathFromField(field);
	    }
	    else if (opt.expr) {
	        // Expression to access flattened field. No need to escape dots.
	        return flatAccessWithDatum(field, opt.expr) + argAccessor;
	    }
	    else {
	        // We flattened all fields so paths should have become dot.
	        return replacePathInField(field) + argAccessor;
	    }
	}
	function isDiscrete(def) {
	    switch (def.type) {
	        case 'nominal':
	        case 'ordinal':
	        case 'geojson':
	            return true;
	        case 'quantitative':
	            return isFieldDef(def) && !!def.bin;
	        case 'temporal':
	            return false;
	    }
	    throw new Error(invalidFieldType(def.type));
	}
	function isContinuous(fieldDef) {
	    return !isDiscrete(fieldDef);
	}
	function isCount(fieldDef) {
	    return fieldDef.aggregate === 'count';
	}
	function verbalTitleFormatter(fieldDef, config) {
	    var _a;
	    const { field, bin, timeUnit, aggregate } = fieldDef;
	    if (aggregate === 'count') {
	        return config.countTitle;
	    }
	    else if (isBinning(bin)) {
	        return `${field} (binned)`;
	    }
	    else if (timeUnit) {
	        const unit = (_a = normalizeTimeUnit(timeUnit)) === null || _a === void 0 ? void 0 : _a.unit;
	        if (unit) {
	            return `${field} (${getTimeUnitParts(unit).join('-')})`;
	        }
	    }
	    else if (aggregate) {
	        if (isArgmaxDef(aggregate)) {
	            return `${field} for max ${aggregate.argmax}`;
	        }
	        else if (isArgminDef(aggregate)) {
	            return `${field} for min ${aggregate.argmin}`;
	        }
	        else {
	            return `${titleCase(aggregate)} of ${field}`;
	        }
	    }
	    return field;
	}
	function functionalTitleFormatter(fieldDef) {
	    const { aggregate, bin, timeUnit, field } = fieldDef;
	    if (isArgmaxDef(aggregate)) {
	        return `${field} for argmax(${aggregate.argmax})`;
	    }
	    else if (isArgminDef(aggregate)) {
	        return `${field} for argmin(${aggregate.argmin})`;
	    }
	    const timeUnitParams = normalizeTimeUnit(timeUnit);
	    const fn = aggregate || (timeUnitParams === null || timeUnitParams === void 0 ? void 0 : timeUnitParams.unit) || ((timeUnitParams === null || timeUnitParams === void 0 ? void 0 : timeUnitParams.maxbins) && 'timeunit') || (isBinning(bin) && 'bin');
	    if (fn) {
	        return fn.toUpperCase() + '(' + field + ')';
	    }
	    else {
	        return field;
	    }
	}
	const defaultTitleFormatter = (fieldDef, config) => {
	    switch (config.fieldTitle) {
	        case 'plain':
	            return fieldDef.field;
	        case 'functional':
	            return functionalTitleFormatter(fieldDef);
	        default:
	            return verbalTitleFormatter(fieldDef, config);
	    }
	};
	let titleFormatter = defaultTitleFormatter;
	function setTitleFormatter(formatter) {
	    titleFormatter = formatter;
	}
	function resetTitleFormatter() {
	    setTitleFormatter(defaultTitleFormatter);
	}
	function title(fieldOrDatumDef, config, { allowDisabling, includeDefault = true }) {
	    var _a, _b;
	    const guideTitle = (_a = getGuide(fieldOrDatumDef)) === null || _a === void 0 ? void 0 : _a.title;
	    if (!isFieldDef(fieldOrDatumDef)) {
	        return guideTitle;
	    }
	    const fieldDef = fieldOrDatumDef;
	    const def = includeDefault ? defaultTitle(fieldDef, config) : undefined;
	    if (allowDisabling) {
	        return getFirstDefined(guideTitle, fieldDef.title, def);
	    }
	    else {
	        return (_b = guideTitle !== null && guideTitle !== void 0 ? guideTitle : fieldDef.title) !== null && _b !== void 0 ? _b : def;
	    }
	}
	function getGuide(fieldDef) {
	    if (isPositionFieldOrDatumDef(fieldDef) && fieldDef.axis) {
	        return fieldDef.axis;
	    }
	    else if (isMarkPropFieldOrDatumDef(fieldDef) && fieldDef.legend) {
	        return fieldDef.legend;
	    }
	    else if (isFacetFieldDef(fieldDef) && fieldDef.header) {
	        return fieldDef.header;
	    }
	    return undefined;
	}
	function defaultTitle(fieldDef, config) {
	    return titleFormatter(fieldDef, config);
	}
	function getFormatMixins(fieldDef) {
	    var _a;
	    if (isStringFieldOrDatumDef(fieldDef)) {
	        const { format, formatType } = fieldDef;
	        return { format, formatType };
	    }
	    else {
	        const guide = (_a = getGuide(fieldDef)) !== null && _a !== void 0 ? _a : {};
	        const { format, formatType } = guide;
	        return { format, formatType };
	    }
	}
	function defaultType(fieldDef, channel) {
	    var _a;
	    switch (channel) {
	        case 'latitude':
	        case 'longitude':
	            return 'quantitative';
	        case 'row':
	        case 'column':
	        case 'facet':
	        case 'shape':
	        case 'strokeDash':
	            return 'nominal';
	        case 'order':
	            return 'ordinal';
	    }
	    if (isSortableFieldDef(fieldDef) && isArray(fieldDef.sort)) {
	        return 'ordinal';
	    }
	    const { aggregate, bin, timeUnit } = fieldDef;
	    if (timeUnit) {
	        return 'temporal';
	    }
	    if (bin || (aggregate && !isArgmaxDef(aggregate) && !isArgminDef(aggregate))) {
	        return 'quantitative';
	    }
	    if (isScaleFieldDef(fieldDef) && ((_a = fieldDef.scale) === null || _a === void 0 ? void 0 : _a.type)) {
	        switch (SCALE_CATEGORY_INDEX[fieldDef.scale.type]) {
	            case 'numeric':
	            case 'discretizing':
	                return 'quantitative';
	            case 'time':
	                return 'temporal';
	        }
	    }
	    return 'nominal';
	}
	/**
	 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
	 * @param channelDef
	 */
	function getFieldDef(channelDef) {
	    if (isFieldDef(channelDef)) {
	        return channelDef;
	    }
	    else if (hasConditionalFieldDef(channelDef)) {
	        return channelDef.condition;
	    }
	    return undefined;
	}
	function getFieldOrDatumDef(channelDef) {
	    if (isFieldOrDatumDef(channelDef)) {
	        return channelDef;
	    }
	    else if (hasConditionalFieldOrDatumDef(channelDef)) {
	        return channelDef.condition;
	    }
	    return undefined;
	}
	/**
	 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
	 */
	function initChannelDef(channelDef, channel, config, opt = {}) {
	    if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
	        const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
	        warn(primitiveChannelDef(channel, primitiveType, channelDef));
	        return { value: channelDef };
	    }
	    // If a fieldDef contains a field, we need type.
	    if (isFieldOrDatumDef(channelDef)) {
	        return initFieldOrDatumDef(channelDef, channel, config, opt);
	    }
	    else if (hasConditionalFieldOrDatumDef(channelDef)) {
	        return Object.assign(Object.assign({}, channelDef), { 
	            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
	            condition: initFieldOrDatumDef(channelDef.condition, channel, config, opt) });
	    }
	    return channelDef;
	}
	function initFieldOrDatumDef(fd, channel, config, opt) {
	    if (isStringFieldOrDatumDef(fd)) {
	        const { format, formatType } = fd, rest = __rest$5(fd, ["format", "formatType"]);
	        if (isCustomFormatType(formatType) && !config.customFormatTypes) {
	            warn(customFormatTypeNotAllowed(channel));
	            return initFieldOrDatumDef(rest, channel, config, opt);
	        }
	    }
	    else {
	        const guideType = isPositionFieldOrDatumDef(fd)
	            ? 'axis'
	            : isMarkPropFieldOrDatumDef(fd)
	                ? 'legend'
	                : isFacetFieldDef(fd)
	                    ? 'header'
	                    : null;
	        if (guideType && fd[guideType]) {
	            const _a = fd[guideType], { format, formatType } = _a, newGuide = __rest$5(_a, ["format", "formatType"]);
	            if (isCustomFormatType(formatType) && !config.customFormatTypes) {
	                warn(customFormatTypeNotAllowed(channel));
	                return initFieldOrDatumDef(Object.assign(Object.assign({}, fd), { [guideType]: newGuide }), channel, config, opt);
	            }
	        }
	    }
	    if (isFieldDef(fd)) {
	        return initFieldDef(fd, channel, opt);
	    }
	    return initDatumDef(fd);
	}
	function initDatumDef(datumDef) {
	    let type = datumDef['type'];
	    if (type) {
	        return datumDef;
	    }
	    const { datum } = datumDef;
	    type = isNumber(datum) ? 'quantitative' : isString(datum) ? 'nominal' : isDateTime(datum) ? 'temporal' : undefined;
	    return Object.assign(Object.assign({}, datumDef), { type });
	}
	function initFieldDef(fd, channel, { compositeMark = false } = {}) {
	    const { aggregate, timeUnit, bin, field } = fd;
	    const fieldDef = Object.assign({}, fd);
	    // Drop invalid aggregate
	    if (!compositeMark && aggregate && !isAggregateOp(aggregate) && !isArgmaxDef(aggregate) && !isArgminDef(aggregate)) {
	        warn(invalidAggregate(aggregate));
	        delete fieldDef.aggregate;
	    }
	    // Normalize Time Unit
	    if (timeUnit) {
	        fieldDef.timeUnit = normalizeTimeUnit(timeUnit);
	    }
	    if (field) {
	        fieldDef.field = `${field}`;
	    }
	    // Normalize bin
	    if (isBinning(bin)) {
	        fieldDef.bin = normalizeBin(bin, channel);
	    }
	    if (isBinned(bin) && !isXorY(channel)) {
	        warn(channelShouldNotBeUsedForBinned(channel));
	    }
	    // Normalize Type
	    if (isTypedFieldDef(fieldDef)) {
	        const { type } = fieldDef;
	        const fullType = getFullName(type);
	        if (type !== fullType) {
	            // convert short type to full type
	            fieldDef.type = fullType;
	        }
	        if (type !== 'quantitative') {
	            if (isCountingAggregateOp(aggregate)) {
	                warn(invalidFieldTypeForCountAggregate(type, aggregate));
	                fieldDef.type = 'quantitative';
	            }
	        }
	    }
	    else if (!isSecondaryRangeChannel(channel)) {
	        // If type is empty / invalid, then augment with default type
	        const newType = defaultType(fieldDef, channel);
	        fieldDef['type'] = newType;
	    }
	    if (isTypedFieldDef(fieldDef)) {
	        const { compatible, warning } = channelCompatibility(fieldDef, channel) || {};
	        if (compatible === false) {
	            warn(warning);
	        }
	    }
	    if (isSortableFieldDef(fieldDef) && isString(fieldDef.sort)) {
	        const { sort } = fieldDef;
	        if (isSortByChannel(sort)) {
	            return Object.assign(Object.assign({}, fieldDef), { sort: { encoding: sort } });
	        }
	        const sub = sort.substr(1);
	        if (sort.charAt(0) === '-' && isSortByChannel(sub)) {
	            return Object.assign(Object.assign({}, fieldDef), { sort: { encoding: sub, order: 'descending' } });
	        }
	    }
	    if (isFacetFieldDef(fieldDef)) {
	        const { header } = fieldDef;
	        const { orient } = header, rest = __rest$5(header, ["orient"]);
	        if (orient) {
	            return Object.assign(Object.assign({}, fieldDef), { header: Object.assign(Object.assign({}, rest), { labelOrient: header.labelOrient || orient, titleOrient: header.titleOrient || orient }) });
	        }
	    }
	    return fieldDef;
	}
	function normalizeBin(bin, channel) {
	    if (isBoolean(bin)) {
	        return { maxbins: autoMaxBins(channel) };
	    }
	    else if (bin === 'binned') {
	        return {
	            binned: true
	        };
	    }
	    else if (!bin.maxbins && !bin.step) {
	        return Object.assign(Object.assign({}, bin), { maxbins: autoMaxBins(channel) });
	    }
	    else {
	        return bin;
	    }
	}
	const COMPATIBLE = { compatible: true };
	function channelCompatibility(fieldDef, channel) {
	    const type = fieldDef.type;
	    if (type === 'geojson' && channel !== 'shape') {
	        return {
	            compatible: false,
	            warning: `Channel ${channel} should not be used with a geojson data.`
	        };
	    }
	    switch (channel) {
	        case ROW:
	        case COLUMN:
	        case FACET:
	            if (isContinuous(fieldDef)) {
	                return {
	                    compatible: false,
	                    warning: facetChannelShouldBeDiscrete(channel)
	                };
	            }
	            return COMPATIBLE;
	        case X:
	        case Y:
	        case COLOR:
	        case FILL:
	        case STROKE:
	        case TEXT:
	        case DETAIL:
	        case KEY:
	        case TOOLTIP:
	        case HREF:
	        case URL:
	        case ANGLE:
	        case THETA:
	        case RADIUS:
	        case DESCRIPTION:
	            return COMPATIBLE;
	        case LONGITUDE:
	        case LONGITUDE2:
	        case LATITUDE:
	        case LATITUDE2:
	            if (type !== QUANTITATIVE) {
	                return {
	                    compatible: false,
	                    warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
	                };
	            }
	            return COMPATIBLE;
	        case OPACITY:
	        case FILLOPACITY:
	        case STROKEOPACITY:
	        case STROKEWIDTH:
	        case SIZE:
	        case THETA2:
	        case RADIUS2:
	        case X2:
	        case Y2:
	            if (type === 'nominal' && !fieldDef['sort']) {
	                return {
	                    compatible: false,
	                    warning: `Channel ${channel} should not be used with an unsorted discrete field.`
	                };
	            }
	            return COMPATIBLE;
	        case STROKEDASH:
	            if (!contains(['ordinal', 'nominal'], fieldDef.type)) {
	                return {
	                    compatible: false,
	                    warning: 'StrokeDash channel should be used with only discrete data.'
	                };
	            }
	            return COMPATIBLE;
	        case SHAPE:
	            if (!contains(['ordinal', 'nominal', 'geojson'], fieldDef.type)) {
	                return {
	                    compatible: false,
	                    warning: 'Shape channel should be used with only either discrete or geojson data.'
	                };
	            }
	            return COMPATIBLE;
	        case ORDER:
	            if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
	                return {
	                    compatible: false,
	                    warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
	                };
	            }
	            return COMPATIBLE;
	    }
	}
	/**
	 * Check if the field def uses a time format or does not use any format but is temporal
	 * (this does not cover field defs that are temporal but use a number format).
	 */
	function isFieldOrDatumDefForTimeFormat(fieldOrDatumDef) {
	    const { formatType } = getFormatMixins(fieldOrDatumDef);
	    return formatType === 'time' || (!formatType && isTimeFieldDef(fieldOrDatumDef));
	}
	/**
	 * Check if field def has type `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
	 */
	function isTimeFieldDef(def) {
	    return def && (def['type'] === 'temporal' || (isFieldDef(def) && !!def.timeUnit));
	}
	/**
	 * Getting a value associated with a fielddef.
	 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
	 */
	function valueExpr(v, { timeUnit, type, wrapTime, undefinedIfExprNotRequired }) {
	    var _a;
	    const unit = timeUnit && ((_a = normalizeTimeUnit(timeUnit)) === null || _a === void 0 ? void 0 : _a.unit);
	    let isTime = unit || type === 'temporal';
	    let expr;
	    if (isExprRef(v)) {
	        expr = v.expr;
	    }
	    else if (isSignalRef(v)) {
	        expr = v.signal;
	    }
	    else if (isDateTime(v)) {
	        isTime = true;
	        expr = dateTimeToExpr(v);
	    }
	    else if (isString(v) || isNumber(v)) {
	        if (isTime) {
	            expr = `datetime(${JSON.stringify(v)})`;
	            if (isLocalSingleTimeUnit(unit)) {
	                // for single timeUnit, we will use dateTimeToExpr to convert number/string to match the timeUnit
	                if ((isNumber(v) && v < 10000) || (isString(v) && isNaN(Date.parse(v)))) {
	                    expr = dateTimeToExpr({ [unit]: v });
	                }
	            }
	        }
	    }
	    if (expr) {
	        return wrapTime && isTime ? `time(${expr})` : expr;
	    }
	    // number or boolean or normal string
	    return undefinedIfExprNotRequired ? undefined : JSON.stringify(v);
	}
	/**
	 * Standardize value array -- convert each value to Vega expression if applicable
	 */
	function valueArray(fieldOrDatumDef, values) {
	    const { type } = fieldOrDatumDef;
	    return values.map(v => {
	        const expr = valueExpr(v, {
	            timeUnit: isFieldDef(fieldOrDatumDef) ? fieldOrDatumDef.timeUnit : undefined,
	            type,
	            undefinedIfExprNotRequired: true
	        });
	        // return signal for the expression if we need an expression
	        if (expr !== undefined) {
	            return { signal: expr };
	        }
	        // otherwise just return the original value
	        return v;
	    });
	}
	/**
	 * Checks whether a fieldDef for a particular channel requires a computed bin range.
	 */
	function binRequiresRange(fieldDef, channel) {
	    if (!isBinning(fieldDef.bin)) {
	        console.warn('Only call this method for binned field defs.');
	        return false;
	    }
	    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
	    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
	    return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
	}

	var channeldef = /*#__PURE__*/Object.freeze({
		__proto__: null,
		isConditionalSelection: isConditionalSelection,
		isRepeatRef: isRepeatRef,
		toFieldDefBase: toFieldDefBase,
		isSortableFieldDef: isSortableFieldDef,
		getBand: getBand,
		hasBand: hasBand,
		isConditionalDef: isConditionalDef,
		hasConditionalFieldDef: hasConditionalFieldDef,
		hasConditionalFieldOrDatumDef: hasConditionalFieldOrDatumDef,
		hasConditionalValueDef: hasConditionalValueDef,
		isFieldDef: isFieldDef,
		channelDefType: channelDefType,
		isDatumDef: isDatumDef,
		isContinuousFieldOrDatumDef: isContinuousFieldOrDatumDef,
		isQuantitativeFieldOrDatumDef: isQuantitativeFieldOrDatumDef,
		isNumericDataDef: isNumericDataDef,
		isFieldOrDatumDef: isFieldOrDatumDef,
		isTypedFieldDef: isTypedFieldDef,
		isValueDef: isValueDef,
		isScaleFieldDef: isScaleFieldDef,
		isPositionFieldOrDatumDef: isPositionFieldOrDatumDef,
		isMarkPropFieldOrDatumDef: isMarkPropFieldOrDatumDef,
		isStringFieldOrDatumDef: isStringFieldOrDatumDef,
		toStringFieldDef: toStringFieldDef,
		vgField: vgField,
		isDiscrete: isDiscrete,
		isContinuous: isContinuous,
		isCount: isCount,
		verbalTitleFormatter: verbalTitleFormatter,
		functionalTitleFormatter: functionalTitleFormatter,
		defaultTitleFormatter: defaultTitleFormatter,
		setTitleFormatter: setTitleFormatter,
		resetTitleFormatter: resetTitleFormatter,
		title: title,
		getGuide: getGuide,
		defaultTitle: defaultTitle,
		getFormatMixins: getFormatMixins,
		defaultType: defaultType,
		getFieldDef: getFieldDef,
		getFieldOrDatumDef: getFieldOrDatumDef,
		initChannelDef: initChannelDef,
		initFieldOrDatumDef: initFieldOrDatumDef,
		initFieldDef: initFieldDef,
		normalizeBin: normalizeBin,
		channelCompatibility: channelCompatibility,
		isFieldOrDatumDefForTimeFormat: isFieldOrDatumDefForTimeFormat,
		isTimeFieldDef: isTimeFieldDef,
		valueExpr: valueExpr,
		valueArray: valueArray,
		binRequiresRange: binRequiresRange
	});

	/**
	 * Determine if there is a specified scale type and if it is appropriate,
	 * or determine default type if type is unspecified or inappropriate.
	 */
	// NOTE: CompassQL uses this method.
	function scaleType(specifiedScale, channel, fieldDef, mark) {
	    const defaultScaleType = defaultType$1(channel, fieldDef, mark);
	    const { type } = specifiedScale;
	    if (!isScaleChannel(channel)) {
	        // There is no scale for these channels
	        return null;
	    }
	    if (type !== undefined) {
	        // Check if explicitly specified scale type is supported by the channel
	        if (!channelSupportScaleType(channel, type)) {
	            warn(scaleTypeNotWorkWithChannel(channel, type, defaultScaleType));
	            return defaultScaleType;
	        }
	        // Check if explicitly specified scale type is supported by the data type
	        if (isFieldDef(fieldDef) && !scaleTypeSupportDataType(type, fieldDef.type)) {
	            warn(scaleTypeNotWorkWithFieldDef(type, defaultScaleType));
	            return defaultScaleType;
	        }
	        return type;
	    }
	    return defaultScaleType;
	}
	/**
	 * Determine appropriate default scale type.
	 */
	// NOTE: Voyager uses this method.
	function defaultType$1(channel, fieldDef, mark) {
	    var _a;
	    switch (fieldDef.type) {
	        case 'nominal':
	        case 'ordinal':
	            if (isColorChannel(channel) || rangeType(channel) === 'discrete') {
	                if (channel === 'shape' && fieldDef.type === 'ordinal') {
	                    warn(discreteChannelCannotEncode(channel, 'ordinal'));
	                }
	                return 'ordinal';
	            }
	            if (channel in POSITION_SCALE_CHANNEL_INDEX) {
	                if (contains(['rect', 'bar', 'image', 'rule'], mark)) {
	                    // The rect/bar mark should fit into a band.
	                    // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
	                    return 'band';
	                }
	            }
	            else if (mark === 'arc' && channel in POLAR_POSITION_SCALE_CHANNEL_INDEX) {
	                return 'band';
	            }
	            if (fieldDef.band !== undefined || (isPositionFieldOrDatumDef(fieldDef) && ((_a = fieldDef.axis) === null || _a === void 0 ? void 0 : _a.tickBand))) {
	                return 'band';
	            }
	            // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
	            return 'point';
	        case 'temporal':
	            if (isColorChannel(channel)) {
	                return 'time';
	            }
	            else if (rangeType(channel) === 'discrete') {
	                warn(discreteChannelCannotEncode(channel, 'temporal'));
	                // TODO: consider using quantize (equivalent to binning) once we have it
	                return 'ordinal';
	            }
	            else if (isFieldDef(fieldDef) && fieldDef.timeUnit && normalizeTimeUnit(fieldDef.timeUnit).utc) {
	                return 'utc';
	            }
	            return 'time';
	        case 'quantitative':
	            if (isColorChannel(channel)) {
	                if (isFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
	                    return 'bin-ordinal';
	                }
	                return 'linear';
	            }
	            else if (rangeType(channel) === 'discrete') {
	                warn(discreteChannelCannotEncode(channel, 'quantitative'));
	                // TODO: consider using quantize (equivalent to binning) once we have it
	                return 'ordinal';
	            }
	            return 'linear';
	        case 'geojson':
	            return undefined;
	    }
	    /* istanbul ignore next: should never reach this */
	    throw new Error(invalidFieldType(fieldDef.type));
	}

	var type$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		scaleType: scaleType
	});

	var expandedtype = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isDiscrete = exports.ExpandedType = void 0;
	const TYPE = __importStar(require$$1$1);
	var ExpandedType;
	(function (ExpandedType) {
	    ExpandedType.QUANTITATIVE = TYPE.QUANTITATIVE;
	    ExpandedType.ORDINAL = TYPE.ORDINAL;
	    ExpandedType.TEMPORAL = TYPE.TEMPORAL;
	    ExpandedType.NOMINAL = TYPE.NOMINAL;
	    ExpandedType.KEY = 'key';
	})(ExpandedType = exports.ExpandedType || (exports.ExpandedType = {}));
	function isDiscrete(fieldType) {
	    return fieldType === TYPE.ORDINAL || fieldType === TYPE.NOMINAL || fieldType === ExpandedType.KEY;
	}
	exports.isDiscrete = isDiscrete;

	});

	var propindex = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PropIndex = void 0;


	/**
	 * Dictionary that takes property as a key.
	 */
	class PropIndex {
	    constructor(i = null) {
	        this.index = i ? Object.assign({}, i) : {};
	    }
	    has(p) {
	        return property.toKey(p) in this.index;
	    }
	    get(p) {
	        return this.index[property.toKey(p)];
	    }
	    set(p, value) {
	        this.index[property.toKey(p)] = value;
	        return this;
	    }
	    setByKey(key, value) {
	        this.index[key] = value;
	    }
	    map(f) {
	        const i = new PropIndex();
	        for (const k in this.index) {
	            i.index[k] = f(this.index[k]);
	        }
	        return i;
	    }
	    size() {
	        return util$1.keys(this.index).length;
	    }
	    duplicate() {
	        return new PropIndex(this.index);
	    }
	}
	exports.PropIndex = PropIndex;

	});

	var __rest$6 = (undefined && undefined.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	function channelHasField(encoding, channel) {
	    const channelDef = encoding && encoding[channel];
	    if (channelDef) {
	        if (isArray(channelDef)) {
	            return some(channelDef, fieldDef => !!fieldDef.field);
	        }
	        else {
	            return isFieldDef(channelDef) || hasConditionalFieldDef(channelDef);
	        }
	    }
	    return false;
	}
	function isAggregate(encoding) {
	    return some(CHANNELS, channel => {
	        if (channelHasField(encoding, channel)) {
	            const channelDef = encoding[channel];
	            if (isArray(channelDef)) {
	                return some(channelDef, fieldDef => !!fieldDef.aggregate);
	            }
	            else {
	                const fieldDef = getFieldDef(channelDef);
	                return fieldDef && !!fieldDef.aggregate;
	            }
	        }
	        return false;
	    });
	}

	const STACK_OFFSET_INDEX = {
	    zero: 1,
	    center: 1,
	    normalize: 1
	};
	function isStackOffset(s) {
	    return s in STACK_OFFSET_INDEX;
	}
	const STACKABLE_MARKS = new Set([ARC, BAR, AREA, RULE, POINT, CIRCLE, SQUARE, LINE, TEXT$1, TICK]);
	const STACK_BY_DEFAULT_MARKS = new Set([BAR, AREA, ARC]);
	function potentialStackedChannel(encoding, x) {
	    var _a, _b;
	    const y = x === 'x' ? 'y' : 'radius';
	    const xDef = encoding[x];
	    const yDef = encoding[y];
	    if (isFieldDef(xDef) && isFieldDef(yDef)) {
	        if (channelDefType(xDef) === 'quantitative' && channelDefType(yDef) === 'quantitative') {
	            if (xDef.stack) {
	                return x;
	            }
	            else if (yDef.stack) {
	                return y;
	            }
	            const xAggregate = isFieldDef(xDef) && !!xDef.aggregate;
	            const yAggregate = isFieldDef(yDef) && !!yDef.aggregate;
	            // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
	            if (xAggregate !== yAggregate) {
	                return xAggregate ? x : y;
	            }
	            else {
	                const xScale = (_a = xDef.scale) === null || _a === void 0 ? void 0 : _a.type;
	                const yScale = (_b = yDef.scale) === null || _b === void 0 ? void 0 : _b.type;
	                if (xScale && xScale !== 'linear') {
	                    return y;
	                }
	                else if (yScale && yScale !== 'linear') {
	                    return x;
	                }
	            }
	        }
	        else if (channelDefType(xDef) === 'quantitative') {
	            return x;
	        }
	        else if (channelDefType(yDef) === 'quantitative') {
	            return y;
	        }
	    }
	    else if (channelDefType(xDef) === 'quantitative') {
	        return x;
	    }
	    else if (channelDefType(yDef) === 'quantitative') {
	        return y;
	    }
	    return undefined;
	}
	function getDimensionChannel(channel) {
	    switch (channel) {
	        case 'x':
	            return 'y';
	        case 'y':
	            return 'x';
	        case 'theta':
	            return 'radius';
	        case 'radius':
	            return 'theta';
	    }
	}
	// Note: CompassQL uses this method and only pass in required properties of each argument object.
	// If required properties change, make sure to update CompassQL.
	function stack(m, encoding, opt = {}) {
	    const mark = isMarkDef(m) ? m.type : m;
	    // Should have stackable mark
	    if (!STACKABLE_MARKS.has(mark)) {
	        return null;
	    }
	    // Run potential stacked twice, one for Cartesian and another for Polar,
	    // so text marks can be stacked in any of the coordinates.
	    // Note: The logic here is not perfectly correct.  If we want to support stacked dot plots where each dot is a pie chart with label, we have to change the stack logic here to separate Cartesian stacking for polar stacking.
	    // However, since we probably never want to do that, let's just note the limitation here.
	    const fieldChannel = potentialStackedChannel(encoding, 'x') || potentialStackedChannel(encoding, 'theta');
	    if (!fieldChannel) {
	        return null;
	    }
	    const stackedFieldDef = encoding[fieldChannel];
	    const stackedField = isFieldDef(stackedFieldDef) ? vgField(stackedFieldDef, {}) : undefined;
	    let dimensionChannel = getDimensionChannel(fieldChannel);
	    let dimensionDef = encoding[dimensionChannel];
	    let dimensionField = isFieldDef(dimensionDef) ? vgField(dimensionDef, {}) : undefined;
	    // avoid grouping by the stacked field
	    if (dimensionField === stackedField) {
	        dimensionField = undefined;
	        dimensionDef = undefined;
	        dimensionChannel = undefined;
	    }
	    // Should have grouping level of detail that is different from the dimension field
	    const stackBy = NONPOSITION_CHANNELS.reduce((sc, channel) => {
	        // Ignore tooltip in stackBy (https://github.com/vega/vega-lite/issues/4001)
	        if (channel !== 'tooltip' && channelHasField(encoding, channel)) {
	            const channelDef = encoding[channel];
	            for (const cDef of array(channelDef)) {
	                const fieldDef = getFieldDef(cDef);
	                if (fieldDef.aggregate) {
	                    continue;
	                }
	                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
	                const f = vgField(fieldDef, {});
	                if (
	                // if fielddef is a repeat, just include it in the stack by
	                !f ||
	                    // otherwise, the field must be different from x and y fields.
	                    f !== dimensionField) {
	                    sc.push({ channel, fieldDef });
	                }
	            }
	        }
	        return sc;
	    }, []);
	    // Automatically determine offset
	    let offset;
	    if (stackedFieldDef.stack !== undefined) {
	        if (isBoolean(stackedFieldDef.stack)) {
	            offset = stackedFieldDef.stack ? 'zero' : null;
	        }
	        else {
	            offset = stackedFieldDef.stack;
	        }
	    }
	    else if (stackBy.length > 0 && STACK_BY_DEFAULT_MARKS.has(mark)) {
	        // Bar and Area with sum ops are automatically stacked by default
	        offset = 'zero';
	    }
	    if (!offset || !isStackOffset(offset)) {
	        return null;
	    }
	    if (isAggregate(encoding) && stackBy.length === 0) {
	        return null;
	    }
	    // warn when stacking non-linear
	    if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== ScaleType.LINEAR) {
	        if (opt.disallowNonLinearStack) {
	            return null;
	        }
	        else {
	            warn(cannotStackNonLinearScale(stackedFieldDef.scale.type));
	        }
	    }
	    // Check if it is a ranged mark
	    if (isFieldOrDatumDef(encoding[getSecondaryRangeChannel(fieldChannel)])) {
	        if (stackedFieldDef.stack !== undefined) {
	            warn(cannotStackRangedMark(fieldChannel));
	        }
	        return null;
	    }
	    // Warn if stacking non-summative aggregate
	    if (isFieldDef(stackedFieldDef) && stackedFieldDef.aggregate && !contains(SUM_OPS, stackedFieldDef.aggregate)) {
	        warn(stackNonSummativeAggregate(stackedFieldDef.aggregate));
	    }
	    return {
	        groupbyChannel: dimensionDef ? dimensionChannel : undefined,
	        groupbyField: dimensionField,
	        fieldChannel,
	        impute: stackedFieldDef.impute === null ? false : isPathMark(mark),
	        stackBy,
	        offset
	    };
	}

	var stack$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		isStackOffset: isStackOffset,
		STACKABLE_MARKS: STACKABLE_MARKS,
		STACK_BY_DEFAULT_MARKS: STACK_BY_DEFAULT_MARKS,
		stack: stack
	});

	var stack_1 = /*@__PURE__*/getAugmentedNamespace(stack$1);

	var spec = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hasWildcard = exports.hasRequiredStackProperties = exports.getStackChannel = exports.getStackOffset = exports.getVlStack = exports.isAggregate = exports.fromSpec = void 0;






	/**
	 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
	 * @param {ExtendedUnitSpec} spec
	 * @returns
	 */
	function fromSpec(spec) {
	    return util$1.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, spec.background ? { background: spec.background } : {}, spec.padding ? { padding: spec.padding } : {}, spec.title ? { title: spec.title } : {}, {
	        mark: spec.mark,
	        encodings: util$1.keys(spec.encoding).map((channel) => {
	            let encQ = { channel: channel };
	            let channelDef = spec.encoding[channel];
	            for (const prop in channelDef) {
	                if (property.isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
	                    // Currently bin, scale, axis, legend only support boolean, but not null.
	                    // Therefore convert null to false.
	                    if (util$1.contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
	                        encQ[prop] = false;
	                    }
	                    else {
	                        encQ[prop] = channelDef[prop];
	                    }
	                }
	            }
	            if (encoding.isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
	                encQ.field = '*';
	            }
	            return encQ;
	        })
	    }, spec.config ? { config: spec.config } : {});
	}
	exports.fromSpec = fromSpec;
	function isAggregate(specQ) {
	    return util$1.some(specQ.encodings, (encQ) => {
	        return (encoding.isFieldQuery(encQ) && !wildcard.isWildcard(encQ.aggregate) && !!encQ.aggregate) || encoding.isEnabledAutoCountQuery(encQ);
	    });
	}
	exports.isAggregate = isAggregate;
	/**
	 * @return The Vega-Lite `StackProperties` object that describes the stack
	 * configuration of `specQ`. Returns `null` if this is not stackable.
	 */
	function getVlStack(specQ) {
	    if (!hasRequiredStackProperties(specQ)) {
	        return null;
	    }
	    const encoding$1 = encoding.toEncoding(specQ.encodings, { schema: null, wildcardMode: 'null' });
	    const mark = specQ.mark;
	    return stack_1.stack(mark, encoding$1, { disallowNonLinearStack: true });
	}
	exports.getVlStack = getVlStack;
	/**
	 * @return The `StackOffset` specified in `specQ`, `undefined` if none
	 * is specified.
	 */
	function getStackOffset(specQ) {
	    for (const encQ of specQ.encodings) {
	        if (encQ[property.Property.STACK] !== undefined && !wildcard.isWildcard(encQ[property.Property.STACK])) {
	            return encQ[property.Property.STACK];
	        }
	    }
	    return undefined;
	}
	exports.getStackOffset = getStackOffset;
	/**
	 * @return The `ExtendedChannel` in which `stack` is specified in `specQ`, or
	 * `null` if none is specified.
	 */
	function getStackChannel(specQ) {
	    for (const encQ of specQ.encodings) {
	        if (encQ[property.Property.STACK] !== undefined && !wildcard.isWildcard(encQ.channel)) {
	            return encQ.channel;
	        }
	    }
	    return null;
	}
	exports.getStackChannel = getStackChannel;
	/**
	 * Returns true iff the given SpecQuery has the properties defined
	 * to be a potential Stack spec.
	 * @param specQ The SpecQuery in question.
	 */
	function hasRequiredStackProperties(specQ) {
	    // TODO(haldenl): make this leaner, a lot of encQ properties aren't required for stack.
	    // TODO(haldenl): check mark, then encodings
	    if (wildcard.isWildcard(specQ.mark)) {
	        return false;
	    }
	    const requiredEncodingProps = [
	        property.Property.STACK,
	        property.Property.CHANNEL,
	        property.Property.MARK,
	        property.Property.FIELD,
	        property.Property.AGGREGATE,
	        property.Property.AUTOCOUNT,
	        property.Property.SCALE,
	        property.getEncodingNestedProp('scale', 'type'),
	        property.Property.TYPE
	    ];
	    const exclude = util.toMap(util$1.without(property.ALL_ENCODING_PROPS, requiredEncodingProps));
	    const encodings = specQ.encodings.filter(encQ => !encoding.isDisabledAutoCountQuery(encQ));
	    for (const encQ of encodings) {
	        if (objectContainsWildcard(encQ, { exclude: exclude })) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.hasRequiredStackProperties = hasRequiredStackProperties;
	/**
	 * Returns true iff the given object does not contain a nested wildcard.
	 * @param obj The object in question.
	 * @param opt With optional `exclude` property, which defines properties to
	 * ignore when testing for wildcards.
	 */
	// TODO(haldenl): rename to objectHasWildcard, rename prop to obj
	function objectContainsWildcard(obj, opt = {}) {
	    if (!util$1.isObject(obj)) {
	        return false;
	    }
	    for (const childProp in obj) {
	        if (obj.hasOwnProperty(childProp)) {
	            const wildcard$1 = wildcard.isWildcard(obj[childProp]);
	            if ((wildcard$1 && (!opt.exclude || !opt.exclude[childProp])) || objectContainsWildcard(obj[childProp], opt)) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	/**
	 * Returns true iff the given `specQ` contains a wildcard.
	 * @param specQ The `SpecQuery` in question.
	 * @param opt With optional `exclude` property, which defines properties to
	 * ignore when testing for wildcards.
	 */
	function hasWildcard(specQ, opt = {}) {
	    const exclude = opt.exclude ? util.toMap(opt.exclude.map(property.toKey)) : {};
	    if (wildcard.isWildcard(specQ.mark) && !exclude['mark']) {
	        return true;
	    }
	    for (const encQ of specQ.encodings) {
	        if (objectContainsWildcard(encQ, exclude)) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.hasWildcard = hasWildcard;

	});

	var aggregate_1 = /*@__PURE__*/getAugmentedNamespace(aggregate);

	var timeunit_1 = /*@__PURE__*/getAugmentedNamespace(timeunit);

	var shorthand = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shorthandParser = exports.splitWithTail = exports.parse = exports.fieldDef = exports.encoding = exports.spec = exports.PROPERTY_SUPPORTED_CHANNELS = exports.vlSpec = exports.INCLUDE_ALL = exports.REPLACE_NONE = exports.replace = exports.value = exports.getReplacer = exports.getReplacerIndex = void 0;




	const TYPE = __importStar(require$$1$1);
	const type_1 = require$$1$1;






	function getReplacerIndex(replaceIndex) {
	    return replaceIndex.map(r => getReplacer(r));
	}
	exports.getReplacerIndex = getReplacerIndex;
	function getReplacer(replace) {
	    return (s) => {
	        if (replace[s] !== undefined) {
	            return replace[s];
	        }
	        return s;
	    };
	}
	exports.getReplacer = getReplacer;
	function value(v, replacer) {
	    if (wildcard.isWildcard(v)) {
	        // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
	        if (!wildcard.isShortWildcard(v) && v.enum) {
	            return wildcard.SHORT_WILDCARD + JSON.stringify(v.enum);
	        }
	        else {
	            return wildcard.SHORT_WILDCARD;
	        }
	    }
	    if (replacer) {
	        return replacer(v);
	    }
	    return v;
	}
	exports.value = value;
	function replace(v, replacer) {
	    if (replacer) {
	        return replacer(v);
	    }
	    return v;
	}
	exports.replace = replace;
	exports.REPLACE_NONE = new propindex.PropIndex();
	exports.INCLUDE_ALL = 
	// FIXME: remove manual TRANSFORM concat once we really support enumerating transform.
	[]
	    .concat(property.DEFAULT_PROP_PRECEDENCE, property.SORT_PROPS, [property.Property.TRANSFORM, property.Property.STACK], property.VIEW_PROPS)
	    .reduce((pi, prop) => pi.set(prop, true), new propindex.PropIndex());
	function vlSpec(vlspec, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
	    const specQ = spec.fromSpec(vlspec);
	    return spec$1(specQ, include, replace);
	}
	exports.vlSpec = vlSpec;
	exports.PROPERTY_SUPPORTED_CHANNELS = {
	    axis: { x: true, y: true, row: true, column: true },
	    legend: { color: true, opacity: true, size: true, shape: true },
	    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
	    sort: { x: true, y: true, path: true, order: true },
	    stack: { x: true, y: true }
	};
	/**
	 * Returns a shorthand for a spec query
	 * @param specQ a spec query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function spec$1(specQ, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
	    const parts = [];
	    if (include.get(property.Property.MARK)) {
	        parts.push(value(specQ.mark, replace.get(property.Property.MARK)));
	    }
	    if (specQ.transform && specQ.transform.length > 0) {
	        parts.push(`transform:${JSON.stringify(specQ.transform)}`);
	    }
	    let stack;
	    if (include.get(property.Property.STACK)) {
	        stack = spec.getVlStack(specQ);
	    }
	    if (specQ.encodings) {
	        const encodings = specQ.encodings
	            .reduce((encQs, encQ) => {
	            // Exclude encoding mapping with autoCount=false as they are basically disabled.
	            if (!encoding.isDisabledAutoCountQuery(encQ)) {
	                let str;
	                if (!!stack && encQ.channel === stack.fieldChannel) {
	                    str = encoding$1(Object.assign(Object.assign({}, encQ), { stack: stack.offset }), include, replace);
	                }
	                else {
	                    str = encoding$1(encQ, include, replace);
	                }
	                if (str) {
	                    // only add if the shorthand isn't an empty string.
	                    encQs.push(str);
	                }
	            }
	            return encQs;
	        }, [])
	            .sort() // sort at the end to ignore order
	            .join('|');
	        if (encodings) {
	            parts.push(encodings);
	        }
	    }
	    for (let viewProp of property.VIEW_PROPS) {
	        const propString = viewProp.toString();
	        if (include.get(viewProp) && !!specQ[propString]) {
	            const value = specQ[propString];
	            parts.push(`${propString}=${JSON.stringify(value)}`);
	        }
	    }
	    return parts.join('|');
	}
	exports.spec = spec$1;
	/**
	 * Returns a shorthand for an encoding query
	 * @param encQ an encoding query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function encoding$1(encQ, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
	    const parts = [];
	    if (include.get(property.Property.CHANNEL)) {
	        parts.push(value(encQ.channel, replace.get(property.Property.CHANNEL)));
	    }
	    if (encoding.isFieldQuery(encQ)) {
	        const fieldDefStr = fieldDef(encQ, include, replace);
	        if (fieldDefStr) {
	            parts.push(fieldDefStr);
	        }
	    }
	    else if (encoding.isValueQuery(encQ)) {
	        parts.push(encQ.value);
	    }
	    else if (encoding.isAutoCountQuery(encQ)) {
	        parts.push('autocount()');
	    }
	    return parts.join(':');
	}
	exports.encoding = encoding$1;
	/**
	 * Returns a field definition shorthand for an encoding query
	 * @param encQ an encoding query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function fieldDef(encQ, include = exports.INCLUDE_ALL, replacer = exports.REPLACE_NONE) {
	    if (include.get(property.Property.AGGREGATE) && encoding.isDisabledAutoCountQuery(encQ)) {
	        return '-';
	    }
	    const fn = func(encQ, include, replacer);
	    const props = fieldDefProps(encQ, include, replacer);
	    let fieldAndParams;
	    if (encoding.isFieldQuery(encQ)) {
	        // field
	        fieldAndParams = include.get('field') ? value(encQ.field, replacer.get('field')) : '...';
	        // type
	        if (include.get(property.Property.TYPE)) {
	            if (wildcard.isWildcard(encQ.type)) {
	                fieldAndParams += `,${value(encQ.type, replacer.get(property.Property.TYPE))}`;
	            }
	            else {
	                const typeShort = (`${encQ.type || TYPE.QUANTITATIVE}`).substr(0, 1);
	                fieldAndParams += `,${value(typeShort, replacer.get(property.Property.TYPE))}`;
	            }
	        }
	        // encoding properties
	        fieldAndParams += props
	            .map(p => {
	            let val = p.value instanceof Array ? `[${p.value}]` : p.value;
	            return `,${p.key}=${val}`;
	        })
	            .join('');
	    }
	    else if (encoding.isAutoCountQuery(encQ)) {
	        fieldAndParams = '*,q';
	    }
	    if (!fieldAndParams) {
	        return null;
	    }
	    if (fn) {
	        let fnPrefix = util.isString(fn) ? fn : wildcard.SHORT_WILDCARD + (util$1.keys(fn).length > 0 ? JSON.stringify(fn) : '');
	        return `${fnPrefix}(${fieldAndParams})`;
	    }
	    return fieldAndParams;
	}
	exports.fieldDef = fieldDef;
	/**
	 * Return function part of
	 */
	function func(fieldQ, include, replacer) {
	    if (include.get(property.Property.AGGREGATE) && fieldQ.aggregate && !wildcard.isWildcard(fieldQ.aggregate)) {
	        return replace(fieldQ.aggregate, replacer.get(property.Property.AGGREGATE));
	    }
	    else if (include.get(property.Property.AGGREGATE) && encoding.isEnabledAutoCountQuery(fieldQ)) {
	        // autoCount is considered a part of aggregate
	        return replace('count', replacer.get(property.Property.AGGREGATE));
	    }
	    else if (include.get(property.Property.TIMEUNIT) && fieldQ.timeUnit && !wildcard.isWildcard(fieldQ.timeUnit)) {
	        return replace(fieldQ.timeUnit, replacer.get(property.Property.TIMEUNIT));
	    }
	    else if (include.get(property.Property.BIN) && fieldQ.bin && !wildcard.isWildcard(fieldQ.bin)) {
	        return 'bin';
	    }
	    else {
	        let fn = null;
	        for (const prop of [property.Property.AGGREGATE, property.Property.AUTOCOUNT, property.Property.TIMEUNIT, property.Property.BIN]) {
	            const val = fieldQ[prop];
	            if (include.get(prop) && fieldQ[prop] && wildcard.isWildcard(val)) {
	                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
	                fn = fn || {};
	                fn[prop] = wildcard.isShortWildcard(val) ? val : val.enum;
	            }
	        }
	        if (fn && fieldQ.hasFn) {
	            fn.hasFn = true;
	        }
	        return fn;
	    }
	}
	/**
	 * Return key-value of parameters of field defs
	 */
	function fieldDefProps(fieldQ, include, replacer) {
	    /** Encoding properties e.g., Scale, Axis, Legend */
	    const props = [];
	    // Parameters of function such as bin will be just top-level properties
	    if (!util$1.isBoolean(fieldQ.bin) && !wildcard.isShortWildcard(fieldQ.bin)) {
	        const bin = fieldQ.bin;
	        for (const child in bin) {
	            const prop = property.getEncodingNestedProp('bin', child);
	            if (prop && include.get(prop) && bin[child] !== undefined) {
	                props.push({
	                    key: child,
	                    value: value(bin[child], replacer.get(prop))
	                });
	            }
	        }
	        // Sort to make sure that parameter are ordered consistently
	        props.sort((a, b) => a.key.localeCompare(b.key));
	    }
	    for (const parent of [property.Property.SCALE, property.Property.SORT, property.Property.STACK, property.Property.AXIS, property.Property.LEGEND]) {
	        if (!wildcard.isWildcard(fieldQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[parent][fieldQ.channel]) {
	            continue;
	        }
	        if (include.get(parent) && fieldQ[parent] !== undefined) {
	            const parentValue = fieldQ[parent];
	            if (util$1.isBoolean(parentValue) || parentValue === null) {
	                // `scale`, `axis`, `legend` can be false/null.
	                props.push({
	                    key: `${parent}`,
	                    value: parentValue || false // return true or false (false if null)
	                });
	            }
	            else if (util.isString(parentValue)) {
	                // `sort` can be a string (ascending/descending).
	                props.push({
	                    key: `${parent}`,
	                    value: replace(JSON.stringify(parentValue), replacer.get(parent))
	                });
	            }
	            else {
	                let nestedPropChildren = [];
	                for (const child in parentValue) {
	                    const nestedProp = property.getEncodingNestedProp(parent, child);
	                    if (nestedProp && include.get(nestedProp) && parentValue[child] !== undefined) {
	                        nestedPropChildren.push({
	                            key: child,
	                            value: value(parentValue[child], replacer.get(nestedProp))
	                        });
	                    }
	                }
	                if (nestedPropChildren.length > 0) {
	                    const nestedPropObject = nestedPropChildren
	                        .sort((a, b) => a.key.localeCompare(b.key))
	                        .reduce((o, item) => {
	                        o[item.key] = item.value;
	                        return o;
	                    }, {});
	                    // Sort to make sure that parameter are ordered consistently
	                    props.push({
	                        key: `${parent}`,
	                        value: JSON.stringify(nestedPropObject)
	                    });
	                }
	            }
	        }
	    }
	    return props;
	}
	function parse(shorthand) {
	    // TODO(https://github.com/uwdata/compassql/issues/259):
	    // Do not split directly, but use an upgraded version of `getClosingBraceIndex()`
	    let splitShorthand = shorthand.split('|');
	    let specQ = {
	        mark: splitShorthand[0],
	        encodings: []
	    };
	    for (let i = 1; i < splitShorthand.length; i++) {
	        let part = splitShorthand[i];
	        const splitPart = splitWithTail(part, ':', 1);
	        const splitPartKey = splitPart[0];
	        const splitPartValue = splitPart[1];
	        if (require$$0.isChannel(splitPartKey) || splitPartKey === '?') {
	            const encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
	            specQ.encodings.push(encQ);
	            continue;
	        }
	        if (splitPartKey === 'transform') {
	            specQ.transform = JSON.parse(splitPartValue);
	            continue;
	        }
	    }
	    return specQ;
	}
	exports.parse = parse;
	/**
	 * Split a string n times into substrings with the specified delimiter and return them as an array.
	 * @param str The string to be split
	 * @param delim The delimiter string used to separate the string
	 * @param number The value used to determine how many times the string is split
	 */
	function splitWithTail(str, delim, count) {
	    let result = [];
	    let lastIndex = 0;
	    for (let i = 0; i < count; i++) {
	        let indexOfDelim = str.indexOf(delim, lastIndex);
	        if (indexOfDelim !== -1) {
	            result.push(str.substring(lastIndex, indexOfDelim));
	            lastIndex = indexOfDelim + 1;
	        }
	        else {
	            break;
	        }
	    }
	    result.push(str.substr(lastIndex));
	    // If the specified count is greater than the number of delimiters that exist in the string,
	    // an empty string will be pushed count minus number of delimiter occurence times.
	    if (result.length !== count + 1) {
	        while (result.length !== count + 1) {
	            result.push('');
	        }
	    }
	    return result;
	}
	exports.splitWithTail = splitWithTail;
	var shorthandParser;
	(function (shorthandParser) {
	    function encoding(channel, fieldDefShorthand) {
	        let encQMixins = fieldDefShorthand.indexOf('(') !== -1
	            ? fn(fieldDefShorthand)
	            : rawFieldDef(splitWithTail(fieldDefShorthand, ',', 2));
	        return Object.assign({ channel }, encQMixins);
	    }
	    shorthandParser.encoding = encoding;
	    function rawFieldDef(fieldDefPart) {
	        const fieldQ = {};
	        fieldQ.field = fieldDefPart[0];
	        fieldQ.type = type_1.getFullName(fieldDefPart[1].toUpperCase()) || '?';
	        let partParams = fieldDefPart[2];
	        let closingBraceIndex = 0;
	        let i = 0;
	        while (i < partParams.length) {
	            let propEqualSignIndex = partParams.indexOf('=', i);
	            let parsedValue;
	            if (propEqualSignIndex !== -1) {
	                let prop = partParams.substring(i, propEqualSignIndex);
	                if (partParams[i + prop.length + 1] === '{') {
	                    let openingBraceIndex = i + prop.length + 1;
	                    closingBraceIndex = getClosingIndex(openingBraceIndex, partParams, '}');
	                    const value = partParams.substring(openingBraceIndex, closingBraceIndex + 1);
	                    parsedValue = JSON.parse(value);
	                    // index after next comma
	                    i = closingBraceIndex + 2;
	                }
	                else if (partParams[i + prop.length + 1] === '[') {
	                    // find closing square bracket
	                    let openingBracketIndex = i + prop.length + 1;
	                    let closingBracketIndex = getClosingIndex(openingBracketIndex, partParams, ']');
	                    const value = partParams.substring(openingBracketIndex, closingBracketIndex + 1);
	                    parsedValue = JSON.parse(value);
	                    // index after next comma
	                    i = closingBracketIndex + 2;
	                }
	                else {
	                    let propIndex = i;
	                    // Substring until the next comma (or end of the string)
	                    let nextCommaIndex = partParams.indexOf(',', i + prop.length);
	                    if (nextCommaIndex === -1) {
	                        nextCommaIndex = partParams.length;
	                    }
	                    // index after next comma
	                    i = nextCommaIndex + 1;
	                    parsedValue = JSON.parse(partParams.substring(propIndex + prop.length + 1, nextCommaIndex));
	                }
	                if (property.isEncodingNestedParent(prop)) {
	                    fieldQ[prop] = parsedValue;
	                }
	                else {
	                    // prop is a property of the aggregation function such as bin
	                    fieldQ.bin = fieldQ.bin || {};
	                    fieldQ.bin[prop] = parsedValue;
	                }
	            }
	            else {
	                // something is wrong with the format of the partParams
	                // exits loop if don't have then infintie loop
	                break;
	            }
	        }
	        return fieldQ;
	    }
	    shorthandParser.rawFieldDef = rawFieldDef;
	    function getClosingIndex(openingBraceIndex, str, closingChar) {
	        for (let i = openingBraceIndex; i < str.length; i++) {
	            if (str[i] === closingChar) {
	                return i;
	            }
	        }
	    }
	    shorthandParser.getClosingIndex = getClosingIndex;
	    function fn(fieldDefShorthand) {
	        const fieldQ = {};
	        // Aggregate, Bin, TimeUnit as wildcard case
	        if (fieldDefShorthand[0] === '?') {
	            let closingBraceIndex = getClosingIndex(1, fieldDefShorthand, '}');
	            let fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));
	            for (let encodingProperty in fnEnumIndex) {
	                if (util$1.isArray(fnEnumIndex[encodingProperty])) {
	                    fieldQ[encodingProperty] = { enum: fnEnumIndex[encodingProperty] };
	                }
	                else {
	                    // Definitely a `SHORT_WILDCARD`
	                    fieldQ[encodingProperty] = fnEnumIndex[encodingProperty];
	                }
	            }
	            return Object.assign(Object.assign({}, fieldQ), rawFieldDef(splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2)));
	        }
	        else {
	            let func = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
	            let insideFn = fieldDefShorthand.substring(func.length + 1, fieldDefShorthand.length - 1);
	            let insideFnParts = splitWithTail(insideFn, ',', 2);
	            if (aggregate_1.isAggregateOp(func)) {
	                return Object.assign({ aggregate: func }, rawFieldDef(insideFnParts));
	            }
	            else if (timeunit_1.isUTCTimeUnit(func) || timeunit_1.isLocalSingleTimeUnit(func)) {
	                return Object.assign({ timeUnit: func }, rawFieldDef(insideFnParts));
	            }
	            else if (func === 'bin') {
	                return Object.assign({ bin: {} }, rawFieldDef(insideFnParts));
	            }
	        }
	    }
	    shorthandParser.fn = fn;
	})(shorthandParser = exports.shorthandParser || (exports.shorthandParser = {}));

	});

	var channeldef_1 = /*@__PURE__*/getAugmentedNamespace(channeldef);

	var type_1 = /*@__PURE__*/getAugmentedNamespace(type$1);

	var encoding = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scaleType = exports.isDimension = exports.isMeasure = exports.isContinuous = exports.toFieldDef = exports.toValueDef = exports.toEncoding = exports.isEnabledAutoCountQuery = exports.isDisabledAutoCountQuery = exports.isAutoCountQuery = exports.isFieldQuery = exports.isValueQuery = void 0;

	const vlChannelDef = __importStar(channeldef_1);

	const TYPE = __importStar(require$$1$1);




	function isValueQuery(encQ) {
	    return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
	}
	exports.isValueQuery = isValueQuery;
	function isFieldQuery(encQ) {
	    return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
	}
	exports.isFieldQuery = isFieldQuery;
	function isAutoCountQuery(encQ) {
	    return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
	}
	exports.isAutoCountQuery = isAutoCountQuery;
	function isDisabledAutoCountQuery(encQ) {
	    return isAutoCountQuery(encQ) && encQ.autoCount === false;
	}
	exports.isDisabledAutoCountQuery = isDisabledAutoCountQuery;
	function isEnabledAutoCountQuery(encQ) {
	    return isAutoCountQuery(encQ) && encQ.autoCount === true;
	}
	exports.isEnabledAutoCountQuery = isEnabledAutoCountQuery;
	const DEFAULT_PROPS = [
	    property.Property.AGGREGATE,
	    property.Property.BIN,
	    property.Property.TIMEUNIT,
	    property.Property.FIELD,
	    property.Property.TYPE,
	    property.Property.SCALE,
	    property.Property.SORT,
	    property.Property.AXIS,
	    property.Property.LEGEND,
	    property.Property.STACK,
	    property.Property.FORMAT
	];
	function toEncoding(encQs, params) {
	    let encoding = {};
	    for (const encQ of encQs) {
	        if (isDisabledAutoCountQuery(encQ)) {
	            continue; // Do not include this in the output.
	        }
	        const { channel } = encQ;
	        // if channel is a wildcard, return null
	        if (wildcard.isWildcard(channel)) {
	            throw new Error('Cannot convert wildcard channel to a fixed channel');
	        }
	        const channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);
	        if (channelDef === null) {
	            if (params.wildcardMode === 'null') {
	                // contains invalid property (e.g., wildcard, thus cannot return a proper spec.)
	                return null;
	            }
	            continue;
	        }
	        // Otherwise, we can set the channelDef
	        encoding[channel] = channelDef;
	    }
	    return encoding;
	}
	exports.toEncoding = toEncoding;
	function toValueDef(valueQ) {
	    const { value } = valueQ;
	    if (wildcard.isWildcard(value)) {
	        return null;
	    }
	    return { value };
	}
	exports.toValueDef = toValueDef;
	function toFieldDef(encQ, params = {}) {
	    const { props = DEFAULT_PROPS, schema, wildcardMode = 'skip' } = params;
	    if (isFieldQuery(encQ)) {
	        const fieldDef = {};
	        for (const prop of props) {
	            let encodingProperty = encQ[prop];
	            if (wildcard.isWildcard(encodingProperty)) {
	                if (wildcardMode === 'skip')
	                    continue;
	                return null;
	            }
	            if (encodingProperty !== undefined) {
	                // if the channel supports this prop
	                const isSupportedByChannel = !shorthand.PROPERTY_SUPPORTED_CHANNELS[prop] || shorthand.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel];
	                if (!isSupportedByChannel) {
	                    continue;
	                }
	                if (property.isEncodingNestedParent(prop) && util.isObject(encodingProperty)) {
	                    encodingProperty = Object.assign({}, encodingProperty); // Make a shallow copy first
	                    for (const childProp in encodingProperty) {
	                        // ensure nested properties are not wildcard before assigning to field def
	                        if (wildcard.isWildcard(encodingProperty[childProp])) {
	                            if (wildcardMode === 'null') {
	                                return null;
	                            }
	                            delete encodingProperty[childProp]; // skip
	                        }
	                    }
	                }
	                if (prop === 'bin' && encodingProperty === false) {
	                    continue;
	                }
	                else if (prop === 'type' && encodingProperty === 'key') {
	                    fieldDef.type = 'nominal';
	                }
	                else {
	                    fieldDef[prop] = encodingProperty;
	                }
	            }
	            if (prop === property.Property.SCALE && schema && encQ.type === TYPE.ORDINAL) {
	                const scale = encQ.scale;
	                const { ordinalDomain } = schema.fieldSchema(encQ.field);
	                if (scale !== null && ordinalDomain) {
	                    fieldDef[property.Property.SCALE] = Object.assign({ domain: ordinalDomain }, (util.isObject(scale) ? scale : {}));
	                }
	            }
	        }
	        return fieldDef;
	    }
	    else {
	        if (encQ.autoCount === false) {
	            throw new Error(`Cannot convert {autoCount: false} into a field def`);
	        }
	        else {
	            return {
	                aggregate: 'count',
	                field: '*',
	                type: 'quantitative'
	            };
	        }
	    }
	}
	exports.toFieldDef = toFieldDef;
	/**
	 * Is a field query continuous field?
	 * This method is applicable only for fieldQuery without wildcard
	 */
	function isContinuous(encQ) {
	    if (isFieldQuery(encQ)) {
	        return vlChannelDef.isContinuous(toFieldDef(encQ, { props: ['bin', 'timeUnit', 'field', 'type'] }));
	    }
	    return isAutoCountQuery(encQ);
	}
	exports.isContinuous = isContinuous;
	function isMeasure(encQ) {
	    if (isFieldQuery(encQ)) {
	        return !isDimension(encQ) && encQ.type !== 'temporal';
	    }
	    return isAutoCountQuery(encQ);
	}
	exports.isMeasure = isMeasure;
	/**
	 * Is a field query discrete field?
	 * This method is applicable only for fieldQuery without wildcard
	 */
	function isDimension(encQ) {
	    if (isFieldQuery(encQ)) {
	        const props = !!encQ['field'] ? ['field', 'bin', 'timeUnit', 'type'] : ['bin', 'timeUnit', 'type'];
	        const fieldDef = toFieldDef(encQ, { props: props });
	        return vlChannelDef.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
	    }
	    return false;
	}
	exports.isDimension = isDimension;
	/**
	 *  Returns the true scale type of an encoding.
	 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's TYPE.
	 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
	 */
	function scaleType(fieldQ) {
	    const scale = fieldQ.scale === true || fieldQ.scale === wildcard.SHORT_WILDCARD ? {} : fieldQ.scale || {};
	    const { type, channel, timeUnit, bin } = fieldQ;
	    // HACK: All of markType, and scaleConfig only affect
	    // sub-type of ordinal to quantitative scales (point or band)
	    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
	    // Thus, instead of making this method requiring the global mark,
	    // we will just call it with mark = undefined .
	    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
	    const markType = undefined;
	    if (wildcard.isWildcard(scale.type) || wildcard.isWildcard(type) || wildcard.isWildcard(channel) || wildcard.isWildcard(bin)) {
	        return undefined;
	    }
	    if (channel === 'row' || channel === 'column' || channel === 'facet') {
	        return undefined;
	    }
	    // If scale type is specified, then use scale.type
	    if (scale.type) {
	        return scale.type;
	    }
	    // if type is fixed and it's not temporal, we can ignore time unit.
	    if (type === 'temporal' && wildcard.isWildcard(timeUnit)) {
	        return undefined;
	    }
	    // if type is fixed and it's not quantitative, we can ignore bin
	    if (type === 'quantitative' && wildcard.isWildcard(bin)) {
	        return undefined;
	    }
	    let vegaLiteType = type === expandedtype.ExpandedType.KEY ? 'nominal' : type;
	    const fieldDef = {
	        type: vegaLiteType,
	        timeUnit: timeUnit,
	        bin: bin
	    };
	    return type_1.scaleType({ type: scale.type }, channel, fieldDef, markType);
	}
	exports.scaleType = scaleType;

	});

	var d3Time = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	   factory(exports) ;
	}(commonjsGlobal, function (exports) {
	  var t0 = new Date;
	  var t1 = new Date;
	  function newInterval(floori, offseti, count, field) {

	    function interval(date) {
	      return floori(date = new Date(+date)), date;
	    }

	    interval.floor = interval;

	    interval.round = function(date) {
	      var d0 = new Date(+date),
	          d1 = new Date(date - 1);
	      floori(d0), floori(d1), offseti(d1, 1);
	      return date - d0 < d1 - date ? d0 : d1;
	    };

	    interval.ceil = function(date) {
	      return floori(date = new Date(date - 1)), offseti(date, 1), date;
	    };

	    interval.offset = function(date, step) {
	      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	    };

	    interval.range = function(start, stop, step) {
	      var range = [];
	      start = new Date(start - 1);
	      stop = new Date(+stop);
	      step = step == null ? 1 : Math.floor(step);
	      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	      offseti(start, 1), floori(start);
	      if (start < stop) range.push(new Date(+start));
	      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
	      return range;
	    };

	    interval.filter = function(test) {
	      return newInterval(function(date) {
	        while (floori(date), !test(date)) date.setTime(date - 1);
	      }, function(date, step) {
	        while (--step >= 0) while (offseti(date, 1), !test(date));
	      });
	    };

	    if (count) {
	      interval.count = function(start, end) {
	        t0.setTime(+start), t1.setTime(+end);
	        floori(t0), floori(t1);
	        return Math.floor(count(t0, t1));
	      };

	      interval.every = function(step) {
	        step = Math.floor(step);
	        return !isFinite(step) || !(step > 0) ? null
	            : !(step > 1) ? interval
	            : interval.filter(field
	                ? function(d) { return field(d) % step === 0; }
	                : function(d) { return interval.count(0, d) % step === 0; });
	      };
	    }

	    return interval;
	  }
	  var millisecond = newInterval(function() {
	    // noop
	  }, function(date, step) {
	    date.setTime(+date + step);
	  }, function(start, end) {
	    return end - start;
	  });

	  // An optimized implementation for this simple case.
	  millisecond.every = function(k) {
	    k = Math.floor(k);
	    if (!isFinite(k) || !(k > 0)) return null;
	    if (!(k > 1)) return millisecond;
	    return newInterval(function(date) {
	      date.setTime(Math.floor(date / k) * k);
	    }, function(date, step) {
	      date.setTime(+date + step * k);
	    }, function(start, end) {
	      return (end - start) / k;
	    });
	  };

	  var second = newInterval(function(date) {
	    date.setMilliseconds(0);
	  }, function(date, step) {
	    date.setTime(+date + step * 1e3);
	  }, function(start, end) {
	    return (end - start) / 1e3;
	  }, function(date) {
	    return date.getSeconds();
	  });

	  var minute = newInterval(function(date) {
	    date.setSeconds(0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 6e4);
	  }, function(start, end) {
	    return (end - start) / 6e4;
	  }, function(date) {
	    return date.getMinutes();
	  });

	  var hour = newInterval(function(date) {
	    date.setMinutes(0, 0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 36e5);
	  }, function(start, end) {
	    return (end - start) / 36e5;
	  }, function(date) {
	    return date.getHours();
	  });

	  var day = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
	  }, function(date) {
	    return date.getDate() - 1;
	  });

	  function weekday(i) {
	    return newInterval(function(date) {
	      date.setHours(0, 0, 0, 0);
	      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    }, function(date, step) {
	      date.setDate(date.getDate() + step * 7);
	    }, function(start, end) {
	      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
	    });
	  }

	  var sunday = weekday(0);
	  var monday = weekday(1);
	  var tuesday = weekday(2);
	  var wednesday = weekday(3);
	  var thursday = weekday(4);
	  var friday = weekday(5);
	  var saturday = weekday(6);

	  var month = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	    date.setDate(1);
	  }, function(date, step) {
	    date.setMonth(date.getMonth() + step);
	  }, function(start, end) {
	    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	  }, function(date) {
	    return date.getMonth();
	  });

	  var year = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	    date.setMonth(0, 1);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step);
	  }, function(start, end) {
	    return end.getFullYear() - start.getFullYear();
	  }, function(date) {
	    return date.getFullYear();
	  });

	  var utcSecond = newInterval(function(date) {
	    date.setUTCMilliseconds(0);
	  }, function(date, step) {
	    date.setTime(+date + step * 1e3);
	  }, function(start, end) {
	    return (end - start) / 1e3;
	  }, function(date) {
	    return date.getUTCSeconds();
	  });

	  var utcMinute = newInterval(function(date) {
	    date.setUTCSeconds(0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 6e4);
	  }, function(start, end) {
	    return (end - start) / 6e4;
	  }, function(date) {
	    return date.getUTCMinutes();
	  });

	  var utcHour = newInterval(function(date) {
	    date.setUTCMinutes(0, 0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 36e5);
	  }, function(start, end) {
	    return (end - start) / 36e5;
	  }, function(date) {
	    return date.getUTCHours();
	  });

	  var utcDay = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step);
	  }, function(start, end) {
	    return (end - start) / 864e5;
	  }, function(date) {
	    return date.getUTCDate() - 1;
	  });

	  function utcWeekday(i) {
	    return newInterval(function(date) {
	      date.setUTCHours(0, 0, 0, 0);
	      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    }, function(date, step) {
	      date.setUTCDate(date.getUTCDate() + step * 7);
	    }, function(start, end) {
	      return (end - start) / 6048e5;
	    });
	  }

	  var utcSunday = utcWeekday(0);
	  var utcMonday = utcWeekday(1);
	  var utcTuesday = utcWeekday(2);
	  var utcWednesday = utcWeekday(3);
	  var utcThursday = utcWeekday(4);
	  var utcFriday = utcWeekday(5);
	  var utcSaturday = utcWeekday(6);

	  var utcMonth = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	    date.setUTCDate(1);
	  }, function(date, step) {
	    date.setUTCMonth(date.getUTCMonth() + step);
	  }, function(start, end) {
	    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	  }, function(date) {
	    return date.getUTCMonth();
	  });

	  var utcYear = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	    date.setUTCMonth(0, 1);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step);
	  }, function(start, end) {
	    return end.getUTCFullYear() - start.getUTCFullYear();
	  }, function(date) {
	    return date.getUTCFullYear();
	  });

	  var milliseconds = millisecond.range;
	  var seconds = second.range;
	  var minutes = minute.range;
	  var hours = hour.range;
	  var days = day.range;
	  var sundays = sunday.range;
	  var mondays = monday.range;
	  var tuesdays = tuesday.range;
	  var wednesdays = wednesday.range;
	  var thursdays = thursday.range;
	  var fridays = friday.range;
	  var saturdays = saturday.range;
	  var weeks = sunday.range;
	  var months = month.range;
	  var years = year.range;

	  var utcMillisecond = millisecond;
	  var utcMilliseconds = milliseconds;
	  var utcSeconds = utcSecond.range;
	  var utcMinutes = utcMinute.range;
	  var utcHours = utcHour.range;
	  var utcDays = utcDay.range;
	  var utcSundays = utcSunday.range;
	  var utcMondays = utcMonday.range;
	  var utcTuesdays = utcTuesday.range;
	  var utcWednesdays = utcWednesday.range;
	  var utcThursdays = utcThursday.range;
	  var utcFridays = utcFriday.range;
	  var utcSaturdays = utcSaturday.range;
	  var utcWeeks = utcSunday.range;
	  var utcMonths = utcMonth.range;
	  var utcYears = utcYear.range;

	  var version = "0.1.1";

	  exports.version = version;
	  exports.milliseconds = milliseconds;
	  exports.seconds = seconds;
	  exports.minutes = minutes;
	  exports.hours = hours;
	  exports.days = days;
	  exports.sundays = sundays;
	  exports.mondays = mondays;
	  exports.tuesdays = tuesdays;
	  exports.wednesdays = wednesdays;
	  exports.thursdays = thursdays;
	  exports.fridays = fridays;
	  exports.saturdays = saturdays;
	  exports.weeks = weeks;
	  exports.months = months;
	  exports.years = years;
	  exports.utcMillisecond = utcMillisecond;
	  exports.utcMilliseconds = utcMilliseconds;
	  exports.utcSeconds = utcSeconds;
	  exports.utcMinutes = utcMinutes;
	  exports.utcHours = utcHours;
	  exports.utcDays = utcDays;
	  exports.utcSundays = utcSundays;
	  exports.utcMondays = utcMondays;
	  exports.utcTuesdays = utcTuesdays;
	  exports.utcWednesdays = utcWednesdays;
	  exports.utcThursdays = utcThursdays;
	  exports.utcFridays = utcFridays;
	  exports.utcSaturdays = utcSaturdays;
	  exports.utcWeeks = utcWeeks;
	  exports.utcMonths = utcMonths;
	  exports.utcYears = utcYears;
	  exports.millisecond = millisecond;
	  exports.second = second;
	  exports.minute = minute;
	  exports.hour = hour;
	  exports.day = day;
	  exports.sunday = sunday;
	  exports.monday = monday;
	  exports.tuesday = tuesday;
	  exports.wednesday = wednesday;
	  exports.thursday = thursday;
	  exports.friday = friday;
	  exports.saturday = saturday;
	  exports.week = sunday;
	  exports.month = month;
	  exports.year = year;
	  exports.utcSecond = utcSecond;
	  exports.utcMinute = utcMinute;
	  exports.utcHour = utcHour;
	  exports.utcDay = utcDay;
	  exports.utcSunday = utcSunday;
	  exports.utcMonday = utcMonday;
	  exports.utcTuesday = utcTuesday;
	  exports.utcWednesday = utcWednesday;
	  exports.utcThursday = utcThursday;
	  exports.utcFriday = utcFriday;
	  exports.utcSaturday = utcSaturday;
	  exports.utcWeek = utcSunday;
	  exports.utcMonth = utcMonth;
	  exports.utcYear = utcYear;
	  exports.interval = newInterval;

	}));
	});

	var tempDate = new Date(),
	    baseDate = new Date(2000, 0, 1),
	    utcBaseDate = new Date(Date.UTC(2000, 0, 1));

	function date(d) {
	  return (tempDate.setTime(+d), tempDate);
	}

	// create a time unit entry
	function entry(type, date, unit, step, min, max) {
	  var e = {
	    type: type,
	    date: date,
	    unit: unit
	  };
	  if (step) {
	    e.step = step;
	  } else {
	    e.minstep = 1;
	  }
	  if (min != null) e.min = min;
	  if (max != null) e.max = max;
	  return e;
	}

	function create(type, unit, base, step, min, max) {
	  return entry(type,
	    function(d) { return unit.offset(base, d); },
	    function(d) { return unit.count(base, d); },
	    step, min, max);
	}

	var locale = [
	  create('second', d3Time.second, baseDate),
	  create('minute', d3Time.minute, baseDate),
	  create('hour',   d3Time.hour,   baseDate),
	  create('day',    d3Time.day,    baseDate, [1, 7]),
	  create('month',  d3Time.month,  baseDate, [1, 3, 6]),
	  create('year',   d3Time.year,   new Date(baseDate).setFullYear(0)),

	  // periodic units
	  entry('seconds',
	    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
	    function(d) { return date(d).getSeconds(); },
	    null, 0, 59
	  ),
	  entry('minutes',
	    function(d) { return new Date(1970, 0, 1, 0, d); },
	    function(d) { return date(d).getMinutes(); },
	    null, 0, 59
	  ),
	  entry('hours',
	    function(d) { return new Date(1970, 0, 1, d); },
	    function(d) { return date(d).getHours(); },
	    null, 0, 23
	  ),
	  entry('weekdays',
	    function(d) { return new Date(1970, 0, 4+d); },
	    function(d) { return date(d).getDay(); },
	    [1], 0, 6
	  ),
	  entry('dates',
	    function(d) { return new Date(1970, 0, d); },
	    function(d) { return date(d).getDate(); },
	    [1], 1, 31
	  ),
	  entry('months',
	    function(d) { return new Date(1970, d % 12, 1); },
	    function(d) { return date(d).getMonth(); },
	    [1], 0, 11
	  )
	];

	var utc = [
	  create('second', d3Time.utcSecond, utcBaseDate),
	  create('minute', d3Time.utcMinute, utcBaseDate),
	  create('hour',   d3Time.utcHour,   utcBaseDate),
	  create('day',    d3Time.utcDay,    utcBaseDate, [1, 7]),
	  create('month',  d3Time.utcMonth,  utcBaseDate, [1, 3, 6]),
	  create('year',   d3Time.utcYear,   new Date(utcBaseDate).setUTCFullYear(0)),

	  // periodic units
	  entry('seconds',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
	    function(d) { return date(d).getUTCSeconds(); },
	    null, 0, 59
	  ),
	  entry('minutes',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
	    function(d) { return date(d).getUTCMinutes(); },
	    null, 0, 59
	  ),
	  entry('hours',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
	    function(d) { return date(d).getUTCHours(); },
	    null, 0, 23
	  ),
	  entry('weekdays',
	    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
	    function(d) { return date(d).getUTCDay(); },
	    [1], 0, 6
	  ),
	  entry('dates',
	    function(d) { return new Date(Date.UTC(1970, 0, d)); },
	    function(d) { return date(d).getUTCDate(); },
	    [1], 1, 31
	  ),
	  entry('months',
	    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
	    function(d) { return date(d).getUTCMonth(); },
	    [1], 0, 11
	  )
	];

	var STEPS = [
	  [31536e6, 5],  // 1-year
	  [7776e6, 4],   // 3-month
	  [2592e6, 4],   // 1-month
	  [12096e5, 3],  // 2-week
	  [6048e5, 3],   // 1-week
	  [1728e5, 3],   // 2-day
	  [864e5, 3],    // 1-day
	  [432e5, 2],    // 12-hour
	  [216e5, 2],    // 6-hour
	  [108e5, 2],    // 3-hour
	  [36e5, 2],     // 1-hour
	  [18e5, 1],     // 30-minute
	  [9e5, 1],      // 15-minute
	  [3e5, 1],      // 5-minute
	  [6e4, 1],      // 1-minute
	  [3e4, 0],      // 30-second
	  [15e3, 0],     // 15-second
	  [5e3, 0],      // 5-second
	  [1e3, 0]       // 1-second
	];

	function find(units, span, minb, maxb) {
	  var step = STEPS[0], i, n, bins;

	  for (i=1, n=STEPS.length; i<n; ++i) {
	    step = STEPS[i];
	    if (span > step[0]) {
	      bins = span / step[0];
	      if (bins > maxb) {
	        return units[STEPS[i-1][1]];
	      }
	      if (bins >= minb) {
	        return units[step[1]];
	      }
	    }
	  }
	  return units[STEPS[n-1][1]];
	}

	function toUnitMap(units) {
	  var map = {}, i, n;
	  for (i=0, n=units.length; i<n; ++i) {
	    map[units[i].type] = units[i];
	  }
	  map.find = function(span, minb, maxb) {
	    return find(units, span, minb, maxb);
	  };
	  return map;
	}

	var time = toUnitMap(locale);
	var utc_1 = toUnitMap(utc);
	time.utc = utc_1;

	var EPSILON = 1e-14;

	function bins(opt) {
	  if (!opt) { throw Error("Missing binning options."); }

	  // determine range
	  var maxb = opt.maxbins || 15,
	      base = opt.base || 10,
	      logb = Math.log(base),
	      div = opt.div || [5, 2],
	      min = opt.min,
	      max = opt.max,
	      span = max - min,
	      step, level, minstep, precision, v, i, eps;

	  if (opt.step) {
	    // if step size is explicitly given, use that
	    step = opt.step;
	  } else if (opt.steps) {
	    // if provided, limit choice to acceptable step sizes
	    step = opt.steps[Math.min(
	      opt.steps.length - 1,
	      bisect(opt.steps, span/maxb, 0, opt.steps.length)
	    )];
	  } else {
	    // else use span to determine step size
	    level = Math.ceil(Math.log(maxb) / logb);
	    minstep = opt.minstep || 0;
	    step = Math.max(
	      minstep,
	      Math.pow(base, Math.round(Math.log(span) / logb) - level)
	    );

	    // increase step size if too many bins
	    while (Math.ceil(span/step) > maxb) { step *= base; }

	    // decrease step size if allowed
	    for (i=0; i<div.length; ++i) {
	      v = step / div[i];
	      if (v >= minstep && span / v <= maxb) step = v;
	    }
	  }

	  // update precision, min and max
	  v = Math.log(step);
	  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
	  eps = Math.pow(base, -precision - 1);
	  min = Math.min(min, Math.floor(min / step + eps) * step);
	  max = Math.ceil(max / step) * step;

	  return {
	    start: min,
	    stop:  max,
	    step:  step,
	    unit:  {precision: precision},
	    value: value$1,
	    index: index
	  };
	}

	function bisect(a, x, lo, hi) {
	  while (lo < hi) {
	    var mid = lo + hi >>> 1;
	    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
	    else { hi = mid; }
	  }
	  return lo;
	}

	function value$1(v) {
	  return this.start + this.step * Math.floor((EPSILON + (v - this.start)) / this.step);
	}


	function index(v) {
	  return Math.floor((v - this.start) / this.step + EPSILON);
	}

	function date_value(v) {
	  return this.unit.date(value$1.call(this, v));
	}

	function date_index(v) {
	  return index.call(this, this.unit.unit(v));
	}

	bins.date = function(opt) {
	  if (!opt) { throw Error("Missing date binning options."); }

	  // find time step, then bin
	  var units = opt.utc ? time.utc : time,
	      dmin = opt.min,
	      dmax = opt.max,
	      maxb = opt.maxbins || 20,
	      minb = opt.minbins || 4,
	      span = (+dmax) - (+dmin),
	      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
	      spec = bins({
	        min:     unit.min != null ? unit.min : unit.unit(dmin),
	        max:     unit.max != null ? unit.max : unit.unit(dmax),
	        maxbins: maxb,
	        minstep: unit.minstep,
	        steps:   unit.step
	      });

	  spec.unit = unit;
	  spec.index = date_index;
	  if (!opt.raw) spec.value = date_value;
	  return spec;
	};

	var bins_1 = bins;

	var TYPES$1 = '__types__';

	var PARSERS = {
	  boolean: util.boolean,
	  integer: util.number,
	  number:  util.number,
	  date:    util.date,
	  string:  function(x) { return x == null || x === '' ? null : x + ''; }
	};

	var TESTS = {
	  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
	  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
	  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
	  date: function(x) { return !isNaN(Date.parse(x)); }
	};

	function annotation(data, types) {
	  if (!types) return data && data[TYPES$1] || null;
	  data[TYPES$1] = types;
	}

	function fieldNames(datum) {
	  return util.keys(datum);
	}

	function bracket(fieldName) {
	  return '[' + fieldName + ']';
	}

	function type$2(values, f) {
	  values = util.array(values);
	  f = util.$(f);
	  var v, i, n;

	  // if data array has type annotations, use them
	  if (values[TYPES$1]) {
	    v = f(values[TYPES$1]);
	    if (util.isString(v)) return v;
	  }

	  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	  }

	  return util.isDate(v) ? 'date' :
	    util.isNumber(v)    ? 'number' :
	    util.isBoolean(v)   ? 'boolean' :
	    util.isString(v)    ? 'string' : null;
	}

	function typeAll(data, fields) {
	  if (!data.length) return;
	  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
	  return fields.reduce(function(types, f) {
	    return (types[f] = type$2(data, get(f)), types);
	  }, {});
	}

	function infer(values, f, ignore) {
	  values = util.array(values);
	  f = util.$(f);
	  var i, j, v;

	  // types to test for, in precedence order
	  var types = ['boolean', 'integer', 'number', 'date'];

	  for (i=0; i<values.length; ++i) {
	    // get next value to test
	    v = f ? f(values[i]) : values[i];
	    // test value against remaining types
	    for (j=0; j<types.length; ++j) {
	      if ((!ignore || !ignore.test(v)) && util.isValid(v) && !TESTS[types[j]](v)) {
	        types.splice(j, 1);
	        j -= 1;
	      }
	    }
	    // if no types left, return 'string'
	    if (types.length === 0) return 'string';
	  }

	  return types[0];
	}

	function inferAll(data, fields, ignore) {
	  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
	  return fields.reduce(function(types, f) {
	    types[f] = infer(data, get(f), ignore);
	    return types;
	  }, {});
	}

	type$2.annotation = annotation;
	type$2.all = typeAll;
	type$2.infer = infer;
	type$2.inferAll = inferAll;
	type$2.parsers = PARSERS;
	var type_1$1 = type$2;

	var generate = createCommonjsModule(function (module) {
	var gen = module.exports;

	gen.repeat = function(val, n) {
	  var a = Array(n), i;
	  for (i=0; i<n; ++i) a[i] = val;
	  return a;
	};

	gen.zeros = function(n) {
	  return gen.repeat(0, n);
	};

	gen.range = function(start, stop, step) {
	  if (arguments.length < 3) {
	    step = 1;
	    if (arguments.length < 2) {
	      stop = start;
	      start = 0;
	    }
	  }
	  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
	  var range = [], i = -1, j;
	  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
	  else while ((j = start + step * ++i) < stop) range.push(j);
	  return range;
	};

	gen.random = {};

	gen.random.uniform = function(min, max) {
	  if (max === undefined) {
	    max = min === undefined ? 1 : min;
	    min = 0;
	  }
	  var d = max - min;
	  var f = function() {
	    return min + d * Math.random();
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    return (x >= min && x <= max) ? 1/d : 0;
	  };
	  f.cdf = function(x) {
	    return x < min ? 0 : x > max ? 1 : (x - min) / d;
	  };
	  f.icdf = function(p) {
	    return (p >= 0 && p <= 1) ? min + p*d : NaN;
	  };
	  return f;
	};

	gen.random.integer = function(a, b) {
	  if (b === undefined) {
	    b = a;
	    a = 0;
	  }
	  var d = b - a;
	  var f = function() {
	    return a + Math.floor(d * Math.random());
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
	  };
	  f.cdf = function(x) {
	    var v = Math.floor(x);
	    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
	  };
	  f.icdf = function(p) {
	    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
	  };
	  return f;
	};

	gen.random.normal = function(mean, stdev) {
	  mean = mean || 0;
	  stdev = stdev || 1;
	  var next;
	  var f = function() {
	    var x = 0, y = 0, rds, c;
	    if (next !== undefined) {
	      x = next;
	      next = undefined;
	      return x;
	    }
	    do {
	      x = Math.random()*2-1;
	      y = Math.random()*2-1;
	      rds = x*x + y*y;
	    } while (rds === 0 || rds > 1);
	    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
	    next = mean + y*c*stdev;
	    return mean + x*c*stdev;
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
	    return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
	  };
	  f.cdf = function(x) {
	    // Approximation from West (2009)
	    // Better Approximations to Cumulative Normal Functions
	    var cd,
	        z = (x - mean) / stdev,
	        Z = Math.abs(z);
	    if (Z > 37) {
	      cd = 0;
	    } else {
	      var sum, exp = Math.exp(-Z*Z/2);
	      if (Z < 7.07106781186547) {
	        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
	        sum = sum * Z + 6.37396220353165;
	        sum = sum * Z + 33.912866078383;
	        sum = sum * Z + 112.079291497871;
	        sum = sum * Z + 221.213596169931;
	        sum = sum * Z + 220.206867912376;
	        cd = exp * sum;
	        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
	        sum = sum * Z + 16.064177579207;
	        sum = sum * Z + 86.7807322029461;
	        sum = sum * Z + 296.564248779674;
	        sum = sum * Z + 637.333633378831;
	        sum = sum * Z + 793.826512519948;
	        sum = sum * Z + 440.413735824752;
	        cd = cd / sum;
	      } else {
	        sum = Z + 0.65;
	        sum = Z + 4 / sum;
	        sum = Z + 3 / sum;
	        sum = Z + 2 / sum;
	        sum = Z + 1 / sum;
	        cd = exp / sum / 2.506628274631;
	      }
	    }
	    return z > 0 ? 1 - cd : cd;
	  };
	  f.icdf = function(p) {
	    // Approximation of Probit function using inverse error function.
	    if (p <= 0 || p >= 1) return NaN;
	    var x = 2*p - 1,
	        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
	        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
	        b = Math.log(1 - (x*x)) / v,
	        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
	    return mean + stdev * Math.SQRT2 * s;
	  };
	  return f;
	};

	gen.random.bootstrap = function(domain, smooth) {
	  // Generates a bootstrap sample from a set of observations.
	  // Smooth bootstrapping adds random zero-centered noise to the samples.
	  var val = domain.filter(util.isValid),
	      len = val.length,
	      err = smooth ? gen.random.normal(0, smooth) : null;
	  var f = function() {
	    return val[~~(Math.random()*len)] + (err ? err() : 0);
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  return f;
	};
	});

	var stats_1 = createCommonjsModule(function (module) {
	var stats = module.exports;

	// Collect unique values.
	// Output: an array of unique values, in first-observed order
	stats.unique = function(values, f, results) {
	  f = util.$(f);
	  results = results || [];
	  var u = {}, v, i, n;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v in u) continue;
	    u[v] = 1;
	    results.push(v);
	  }
	  return results;
	};

	// Return the length of the input array.
	stats.count = function(values) {
	  return values && values.length || 0;
	};

	// Count the number of non-null, non-undefined, non-NaN values.
	stats.count.valid = function(values, f) {
	  f = util.$(f);
	  var v, i, n, valid = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) valid += 1;
	  }
	  return valid;
	};

	// Count the number of null or undefined values.
	stats.count.missing = function(values, f) {
	  f = util.$(f);
	  var v, i, n, count = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v == null) count += 1;
	  }
	  return count;
	};

	// Count the number of distinct values.
	// Null, undefined and NaN are each considered distinct values.
	stats.count.distinct = function(values, f) {
	  f = util.$(f);
	  var u = {}, v, i, n, count = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v in u) continue;
	    u[v] = 1;
	    count += 1;
	  }
	  return count;
	};

	// Construct a map from distinct values to occurrence counts.
	stats.count.map = function(values, f) {
	  f = util.$(f);
	  var map = {}, v, i, n;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    map[v] = (v in map) ? map[v] + 1 : 1;
	  }
	  return map;
	};

	// Compute the median of an array of numbers.
	stats.median = function(values, f) {
	  if (f) values = values.map(util.$(f));
	  values = values.filter(util.isValid).sort(util.cmp);
	  return stats.quantile(values, 0.5);
	};

	// Computes the quartile boundaries of an array of numbers.
	stats.quartile = function(values, f) {
	  if (f) values = values.map(util.$(f));
	  values = values.filter(util.isValid).sort(util.cmp);
	  var q = stats.quantile;
	  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
	};

	// Compute the quantile of a sorted array of numbers.
	// Adapted from the D3.js implementation.
	stats.quantile = function(values, f, p) {
	  if (p === undefined) { p = f; f = util.identity; }
	  f = util.$(f);
	  var H = (values.length - 1) * p + 1,
	      h = Math.floor(H),
	      v = +f(values[h - 1]),
	      e = H - h;
	  return e ? v + e * (f(values[h]) - v) : v;
	};

	// Compute the sum of an array of numbers.
	stats.sum = function(values, f) {
	  f = util.$(f);
	  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) sum += v;
	  }
	  return sum;
	};

	// Compute the mean (average) of an array of numbers.
	stats.mean = function(values, f) {
	  f = util.$(f);
	  var mean = 0, delta, i, n, c, v;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      delta = v - mean;
	      mean = mean + delta / (++c);
	    }
	  }
	  return mean;
	};

	// Compute the geometric mean of an array of numbers.
	stats.mean.geometric = function(values, f) {
	  f = util.$(f);
	  var mean = 1, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v <= 0) {
	        throw Error("Geometric mean only defined for positive values.");
	      }
	      mean *= v;
	      ++c;
	    }
	  }
	  mean = c > 0 ? Math.pow(mean, 1/c) : 0;
	  return mean;
	};

	// Compute the harmonic mean of an array of numbers.
	stats.mean.harmonic = function(values, f) {
	  f = util.$(f);
	  var mean = 0, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      mean += 1/v;
	      ++c;
	    }
	  }
	  return c / mean;
	};

	// Compute the sample variance of an array of numbers.
	stats.variance = function(values, f) {
	  f = util.$(f);
	  if (!util.isArray(values) || values.length < 2) return 0;
	  var mean = 0, M2 = 0, delta, i, c, v;
	  for (i=0, c=0; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      delta = v - mean;
	      mean = mean + delta / (++c);
	      M2 = M2 + delta * (v - mean);
	    }
	  }
	  M2 = M2 / (c - 1);
	  return M2;
	};

	// Compute the sample standard deviation of an array of numbers.
	stats.stdev = function(values, f) {
	  return Math.sqrt(stats.variance(values, f));
	};

	// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
	stats.modeskew = function(values, f) {
	  var avg = stats.mean(values, f),
	      med = stats.median(values, f),
	      std = stats.stdev(values, f);
	  return std === 0 ? 0 : (avg - med) / std;
	};

	// Find the minimum value in an array.
	stats.min = function(values, f) {
	  return stats.extent(values, f)[0];
	};

	// Find the maximum value in an array.
	stats.max = function(values, f) {
	  return stats.extent(values, f)[1];
	};

	// Find the minimum and maximum of an array of values.
	stats.extent = function(values, f) {
	  f = util.$(f);
	  var a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) { a = b = v; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v < a) a = v;
	      if (v > b) b = v;
	    }
	  }
	  return [a, b];
	};

	// Find the integer indices of the minimum and maximum values.
	stats.extent.index = function(values, f) {
	  f = util.$(f);
	  var x = -1, y = -1, a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) { a = b = v; x = y = i; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v < a) { a = v; x = i; }
	      if (v > b) { b = v; y = i; }
	    }
	  }
	  return [x, y];
	};

	// Compute the dot product of two arrays of numbers.
	stats.dot = function(values, a, b) {
	  var sum = 0, i, v;
	  if (!b) {
	    if (values.length !== a.length) {
	      throw Error('Array lengths must match.');
	    }
	    for (i=0; i<values.length; ++i) {
	      v = values[i] * a[i];
	      if (v === v) sum += v;
	    }
	  } else {
	    a = util.$(a);
	    b = util.$(b);
	    for (i=0; i<values.length; ++i) {
	      v = a(values[i]) * b(values[i]);
	      if (v === v) sum += v;
	    }
	  }
	  return sum;
	};

	// Compute the vector distance between two arrays of numbers.
	// Default is Euclidean (exp=2) distance, configurable via exp argument.
	stats.dist = function(values, a, b, exp) {
	  var f = util.isFunction(b) || util.isString(b),
	      X = values,
	      Y = f ? values : a,
	      e = f ? exp : b,
	      L2 = e === 2 || e == null,
	      n = values.length, s = 0, d, i;
	  if (f) {
	    a = util.$(a);
	    b = util.$(b);
	  }
	  for (i=0; i<n; ++i) {
	    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
	    s += L2 ? d*d : Math.pow(Math.abs(d), e);
	  }
	  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
	};

	// Compute the Cohen's d effect size between two arrays of numbers.
	stats.cohensd = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      x1 = stats.mean(X),
	      x2 = stats.mean(Y),
	      n1 = stats.count.valid(X),
	      n2 = stats.count.valid(Y);

	  if ((n1+n2-2) <= 0) {
	    // if both arrays are size 1, or one is empty, there's no effect size
	    return 0;
	  }
	  // pool standard deviation
	  var s1 = stats.variance(X),
	      s2 = stats.variance(Y),
	      s = Math.sqrt((((n1-1)*s1) + ((n2-1)*s2)) / (n1+n2-2));
	  // if there is no variance, there's no effect size
	  return s===0 ? 0 : (x1 - x2) / s;
	};

	// Computes the covariance between two arrays of numbers
	stats.covariance = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n = X.length,
	      xm = stats.mean(X),
	      ym = stats.mean(Y),
	      sum = 0, c = 0, i, x, y, vx, vy;

	  if (n !== Y.length) {
	    throw Error('Input lengths must match.');
	  }

	  for (i=0; i<n; ++i) {
	    x = X[i]; vx = util.isValid(x);
	    y = Y[i]; vy = util.isValid(y);
	    if (vx && vy) {
	      sum += (x-xm) * (y-ym);
	      ++c;
	    } else if (vx || vy) {
	      throw Error('Valid values must align.');
	    }
	  }
	  return sum / (c-1);
	};

	// Compute ascending rank scores for an array of values.
	// Ties are assigned their collective mean rank.
	stats.rank = function(values, f) {
	  f = util.$(f) || util.identity;
	  var a = values.map(function(v, i) {
	      return {idx: i, val: f(v)};
	    })
	    .sort(util.comparator('val'));

	  var n = values.length,
	      r = Array(n),
	      tie = -1, p = {}, i, v, mu;

	  for (i=0; i<n; ++i) {
	    v = a[i].val;
	    if (tie < 0 && p === v) {
	      tie = i - 1;
	    } else if (tie > -1 && p !== v) {
	      mu = 1 + (i-1 + tie) / 2;
	      for (; tie<i; ++tie) r[a[tie].idx] = mu;
	      tie = -1;
	    }
	    r[a[i].idx] = i + 1;
	    p = v;
	  }

	  if (tie > -1) {
	    mu = 1 + (n-1 + tie) / 2;
	    for (; tie<n; ++tie) r[a[tie].idx] = mu;
	  }

	  return r;
	};

	// Compute the sample Pearson product-moment correlation of two arrays of numbers.
	stats.cor = function(values, a, b) {
	  var fn = b;
	  b = fn ? values.map(util.$(b)) : a;
	  a = fn ? values.map(util.$(a)) : values;

	  var dot = stats.dot(a, b),
	      mua = stats.mean(a),
	      mub = stats.mean(b),
	      sda = stats.stdev(a),
	      sdb = stats.stdev(b),
	      n = values.length;

	  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
	};

	// Compute the Spearman rank correlation of two arrays of values.
	stats.cor.rank = function(values, a, b) {
	  var ra = b ? stats.rank(values, a) : stats.rank(values),
	      rb = b ? stats.rank(values, b) : stats.rank(a),
	      n = values.length, i, s, d;

	  for (i=0, s=0; i<n; ++i) {
	    d = ra[i] - rb[i];
	    s += d * d;
	  }

	  return 1 - 6*s / (n * (n*n-1));
	};

	// Compute the distance correlation of two arrays of numbers.
	// http://en.wikipedia.org/wiki/Distance_correlation
	stats.cor.dist = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a;

	  var A = stats.dist.mat(X),
	      B = stats.dist.mat(Y),
	      n = A.length,
	      i, aa, bb, ab;

	  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
	    aa += A[i]*A[i];
	    bb += B[i]*B[i];
	    ab += A[i]*B[i];
	  }

	  return Math.sqrt(ab / Math.sqrt(aa*bb));
	};

	// Simple linear regression.
	// Returns a "fit" object with slope (m), intercept (b),
	// r value (R), and sum-squared residual error (rss).
	stats.linearRegression = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n = X.length,
	      xy = stats.covariance(X, Y), // will throw err if valid vals don't align
	      sx = stats.stdev(X),
	      sy = stats.stdev(Y),
	      slope = xy / (sx*sx),
	      icept = stats.mean(Y) - slope * stats.mean(X),
	      fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
	      res, i;

	  for (i=0; i<n; ++i) {
	    if (util.isValid(X[i]) && util.isValid(Y[i])) {
	      res = (slope*X[i] + icept) - Y[i];
	      fit.rss += res * res;
	    }
	  }

	  return fit;
	};

	// Namespace for bootstrap
	stats.bootstrap = {};

	// Construct a bootstrapped confidence interval at a given percentile level
	// Arguments are an array, an optional n (defaults to 1000),
	//  an optional alpha (defaults to 0.05), and an optional smoothing parameter
	stats.bootstrap.ci = function(values, a, b, c, d) {
	  var X, N, alpha, smooth, bs, means, i;
	  if (util.isFunction(a) || util.isString(a)) {
	    X = values.map(util.$(a));
	    N = b;
	    alpha = c;
	    smooth = d;
	  } else {
	    X = values;
	    N = a;
	    alpha = b;
	    smooth = c;
	  }
	  N = N ? +N : 1000;
	  alpha = alpha || 0.05;

	  bs = generate.random.bootstrap(X, smooth);
	  for (i=0, means = Array(N); i<N; ++i) {
	    means[i] = stats.mean(bs.samples(X.length));
	  }
	  means.sort(util.numcmp);
	  return [
	    stats.quantile(means, alpha/2),
	    stats.quantile(means, 1-(alpha/2))
	  ];
	};

	// Namespace for z-tests
	stats.z = {};

	// Construct a z-confidence interval at a given significance level
	// Arguments are an array and an optional alpha (defaults to 0.05).
	stats.z.ci = function(values, a, b) {
	  var X = values, alpha = a;
	  if (util.isFunction(a) || util.isString(a)) {
	    X = values.map(util.$(a));
	    alpha = b;
	  }
	  alpha = alpha || 0.05;

	  var z = alpha===0.05 ? 1.96 : generate.random.normal(0, 1).icdf(1-(alpha/2)),
	      mu = stats.mean(X),
	      SE = stats.stdev(X) / Math.sqrt(stats.count.valid(X));
	  return [mu - (z*SE), mu + (z*SE)];
	};

	// Perform a z-test of means. Returns the p-value.
	// If a single array is provided, performs a one-sample location test.
	// If two arrays or a table and two accessors are provided, performs
	// a two-sample location test. A paired test is performed if specified
	// by the options hash.
	// The options hash format is: {paired: boolean, nullh: number}.
	// http://en.wikipedia.org/wiki/Z-test
	// http://en.wikipedia.org/wiki/Paired_difference_test
	stats.z.test = function(values, a, b, opt) {
	  if (util.isFunction(b) || util.isString(b)) { // table and accessors
	    return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
	  } else if (util.isArray(a)) { // two arrays
	    return (b && b.paired ? ztestP : ztest2)(b, values, a);
	  } else if (util.isFunction(a) || util.isString(a)) {
	    return ztest1(b, values, a); // table and accessor
	  } else {
	    return ztest1(a, values); // one array
	  }
	};

	// Perform a z-test of means. Returns the p-value.
	// Assuming we have a list of values, and a null hypothesis. If no null
	// hypothesis, assume our null hypothesis is mu=0.
	function ztest1(opt, X, f) {
	  var nullH = opt && opt.nullh || 0,
	      gaussian = generate.random.normal(0, 1),
	      mu = stats.mean(X,f),
	      SE = stats.stdev(X,f) / Math.sqrt(stats.count.valid(X,f));

	  if (SE===0) {
	    // Test not well defined when standard error is 0.
	    return (mu - nullH) === 0 ? 1 : 0;
	  }
	  // Two-sided, so twice the one-sided cdf.
	  var z = (mu - nullH) / SE;
	  return 2 * gaussian.cdf(-Math.abs(z));
	}

	// Perform a two sample paired z-test of means. Returns the p-value.
	function ztestP(opt, values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n1 = stats.count(X),
	      n2 = stats.count(Y),
	      diffs = Array(), i;

	  if (n1 !== n2) {
	    throw Error('Array lengths must match.');
	  }
	  for (i=0; i<n1; ++i) {
	    // Only valid differences should contribute to the test statistic
	    if (util.isValid(X[i]) && util.isValid(Y[i])) {
	      diffs.push(X[i] - Y[i]);
	    }
	  }
	  return stats.z.test(diffs, opt && opt.nullh || 0);
	}

	// Perform a two sample z-test of means. Returns the p-value.
	function ztest2(opt, values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n1 = stats.count.valid(X),
	      n2 = stats.count.valid(Y),
	      gaussian = generate.random.normal(0, 1),
	      meanDiff = stats.mean(X) - stats.mean(Y) - (opt && opt.nullh || 0),
	      SE = Math.sqrt(stats.variance(X)/n1 + stats.variance(Y)/n2);

	  if (SE===0) {
	    // Not well defined when pooled standard error is 0.
	    return meanDiff===0 ? 1 : 0;
	  }
	  // Two-tailed, so twice the one-sided cdf.
	  var z = meanDiff / SE;
	  return 2 * gaussian.cdf(-Math.abs(z));
	}

	// Construct a mean-centered distance matrix for an array of numbers.
	stats.dist.mat = function(X) {
	  var n = X.length,
	      m = n*n,
	      A = Array(m),
	      R = generate.zeros(n),
	      M = 0, v, i, j;

	  for (i=0; i<n; ++i) {
	    A[i*n+i] = 0;
	    for (j=i+1; j<n; ++j) {
	      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
	      A[j*n+i] = v;
	      R[i] += v;
	      R[j] += v;
	    }
	  }

	  for (i=0; i<n; ++i) {
	    M += R[i];
	    R[i] /= n;
	  }
	  M /= m;

	  for (i=0; i<n; ++i) {
	    for (j=i; j<n; ++j) {
	      A[i*n+j] += M - R[i] - R[j];
	      A[j*n+i] = A[i*n+j];
	    }
	  }

	  return A;
	};

	// Compute the Shannon entropy (log base 2) of an array of counts.
	stats.entropy = function(counts, f) {
	  f = util.$(f);
	  var i, p, s = 0, H = 0, n = counts.length;
	  for (i=0; i<n; ++i) {
	    s += (f ? f(counts[i]) : counts[i]);
	  }
	  if (s === 0) return 0;
	  for (i=0; i<n; ++i) {
	    p = (f ? f(counts[i]) : counts[i]) / s;
	    if (p) H += p * Math.log(p);
	  }
	  return -H / Math.LN2;
	};

	// Compute the mutual information between two discrete variables.
	// Returns an array of the form [MI, MI_distance]
	// MI_distance is defined as 1 - I(a,b) / H(a,b).
	// http://en.wikipedia.org/wiki/Mutual_information
	stats.mutual = function(values, a, b, counts) {
	  var x = counts ? values.map(util.$(a)) : values,
	      y = counts ? values.map(util.$(b)) : a,
	      z = counts ? values.map(util.$(counts)) : b;

	  var px = {},
	      py = {},
	      n = z.length,
	      s = 0, I = 0, H = 0, p, t, i;

	  for (i=0; i<n; ++i) {
	    px[x[i]] = 0;
	    py[y[i]] = 0;
	  }

	  for (i=0; i<n; ++i) {
	    px[x[i]] += z[i];
	    py[y[i]] += z[i];
	    s += z[i];
	  }

	  t = 1 / (s * Math.LN2);
	  for (i=0; i<n; ++i) {
	    if (z[i] === 0) continue;
	    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
	    I += z[i] * t * Math.log(p);
	    H += z[i] * t * Math.log(z[i]/s);
	  }

	  return [I, 1 + I/H];
	};

	// Compute the mutual information between two discrete variables.
	stats.mutual.info = function(values, a, b, counts) {
	  return stats.mutual(values, a, b, counts)[0];
	};

	// Compute the mutual information distance between two discrete variables.
	// MI_distance is defined as 1 - I(a,b) / H(a,b).
	stats.mutual.dist = function(values, a, b, counts) {
	  return stats.mutual(values, a, b, counts)[1];
	};

	// Compute a profile of summary statistics for a variable.
	stats.profile = function(values, f) {
	  var mean = 0,
	      valid = 0,
	      missing = 0,
	      distinct = 0,
	      min = null,
	      max = null,
	      M2 = 0,
	      vals = [],
	      u = {}, delta, sd, i, v, x;

	  // compute summary stats
	  for (i=0; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];

	    // update unique values
	    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

	    if (v == null) {
	      ++missing;
	    } else if (util.isValid(v)) {
	      // update stats
	      x = (typeof v === 'string') ? v.length : v;
	      if (min===null || x < min) min = x;
	      if (max===null || x > max) max = x;
	      delta = x - mean;
	      mean = mean + delta / (++valid);
	      M2 = M2 + delta * (x - mean);
	      vals.push(x);
	    }
	  }
	  M2 = M2 / (valid - 1);
	  sd = Math.sqrt(M2);

	  // sort values for median and iqr
	  vals.sort(util.cmp);

	  return {
	    type:     type_1$1(values, f),
	    unique:   u,
	    count:    values.length,
	    valid:    valid,
	    missing:  missing,
	    distinct: distinct,
	    min:      min,
	    max:      max,
	    mean:     mean,
	    stdev:    sd,
	    median:   (v = stats.quantile(vals, 0.5)),
	    q1:       stats.quantile(vals, 0.25),
	    q3:       stats.quantile(vals, 0.75),
	    modeskew: sd === 0 ? 0 : (mean - v) / sd
	  };
	};

	// Compute profiles for all variables in a data set.
	stats.summary = function(data, fields) {
	  fields = fields || util.keys(data[0]);
	  var s = fields.map(function(f) {
	    var p = stats.profile(data, util.$(f));
	    return (p.field = f, p);
	  });
	  return (s.__summary__ = true, s);
	};
	});

	var t0 = new Date,
	    t1 = new Date;

	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
	  }

	  interval.floor = function(date) {
	    return floori(date = new Date(+date)), date;
	  };

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [], previous;
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
	    while (previous < start && start < stop);
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      if (date >= date) {
	        if (step < 0) while (++step <= 0) {
	          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
	        } else while (--step >= 0) {
	          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
	        }
	      }
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0.setTime(+start), t1.setTime(+end);
	      floori(t0), floori(t1);
	      return Math.floor(count(t0, t1));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};

	var durationSecond = 1e3;
	var durationMinute = 6e4;
	var durationHour = 36e5;
	var durationDay = 864e5;
	var durationWeek = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds());
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond);
	}, function(start, end) {
	  return (end - start) / durationSecond;
	}, function(date) {
	  return date.getUTCSeconds();
	});

	var minute = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getMinutes();
	});

	var hour = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getHours();
	});

	var day = newInterval(
	  date => date.setHours(0, 0, 0, 0),
	  (date, step) => date.setDate(date.getDate() + step),
	  (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
	  date => date.getDate() - 1
	);

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	  });
	}

	var sunday = weekday(0);
	var monday = weekday(1);
	var tuesday = weekday(2);
	var wednesday = weekday(3);
	var thursday = weekday(4);
	var friday = weekday(5);
	var saturday = weekday(6);

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getUTCMinutes();
	});

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getUTCHours();
	});

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek;
	  });
	}

	var utcSunday = utcWeekday(0);
	var utcMonday = utcWeekday(1);
	var utcTuesday = utcWeekday(2);
	var utcWednesday = utcWeekday(3);
	var utcThursday = utcWeekday(4);
	var utcFriday = utcWeekday(5);
	var utcSaturday = utcWeekday(6);

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector(f) {
	  let delta = f;
	  let compare = f;

	  if (f.length === 1) {
	    delta = (d, x) => f(d) - x;
	    compare = ascendingComparator(f);
	  }

	  function left(a, x, lo, hi) {
	    if (lo == null) lo = 0;
	    if (hi == null) hi = a.length;
	    while (lo < hi) {
	      const mid = (lo + hi) >>> 1;
	      if (compare(a[mid], x) < 0) lo = mid + 1;
	      else hi = mid;
	    }
	    return lo;
	  }

	  function right(a, x, lo, hi) {
	    if (lo == null) lo = 0;
	    if (hi == null) hi = a.length;
	    while (lo < hi) {
	      const mid = (lo + hi) >>> 1;
	      if (compare(a[mid], x) > 0) hi = mid;
	      else lo = mid + 1;
	    }
	    return lo;
	  }

	  function center(a, x, lo, hi) {
	    if (lo == null) lo = 0;
	    if (hi == null) hi = a.length;
	    const i = left(a, x, lo, hi - 1);
	    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
	  }

	  return {left, center, right};
	}

	function ascendingComparator(f) {
	  return (d, x) => ascending(f(d), x);
	}

	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);

	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;
	  else if (error >= e5) step1 *= 5;
	  else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	const YEAR = 'year';
	const QUARTER = 'quarter';
	const MONTH = 'month';
	const WEEK = 'week';
	const DATE = 'date';
	const DAY = 'day';
	const DAYOFYEAR = 'dayofyear';
	const HOURS = 'hours';
	const MINUTES = 'minutes';
	const SECONDS = 'seconds';
	const MILLISECONDS = 'milliseconds';
	const TIME_UNITS = [YEAR, QUARTER, MONTH, WEEK, DATE, DAY, DAYOFYEAR, HOURS, MINUTES, SECONDS, MILLISECONDS];
	const UNITS = TIME_UNITS.reduce((o, u, i) => (o[u] = 1 + i, o), {});
	function timeUnits(units) {
	  const u = array(units).slice(),
	        m = {}; // check validity

	  if (!u.length) error('Missing time unit.');
	  u.forEach(unit => {
	    if (has(UNITS, unit)) {
	      m[unit] = 1;
	    } else {
	      error("Invalid time unit: ".concat(unit, "."));
	    }
	  });
	  const numTypes = (m[WEEK] || m[DAY] ? 1 : 0) + (m[QUARTER] || m[MONTH] || m[DATE] ? 1 : 0) + (m[DAYOFYEAR] ? 1 : 0);

	  if (numTypes > 1) {
	    error("Incompatible time units: ".concat(units));
	  } // ensure proper sort order


	  u.sort((a, b) => UNITS[a] - UNITS[b]);
	  return u;
	}
	const defaultSpecifiers = {
	  [YEAR]: '%Y ',
	  [QUARTER]: 'Q%q ',
	  [MONTH]: '%b ',
	  [DATE]: '%d ',
	  [WEEK]: 'W%U ',
	  [DAY]: '%a ',
	  [DAYOFYEAR]: '%j ',
	  [HOURS]: '%H:00',
	  [MINUTES]: '00:%M',
	  [SECONDS]: ':%S',
	  [MILLISECONDS]: '.%L',
	  ["".concat(YEAR, "-").concat(MONTH)]: '%Y-%m ',
	  ["".concat(YEAR, "-").concat(MONTH, "-").concat(DATE)]: '%Y-%m-%d ',
	  ["".concat(HOURS, "-").concat(MINUTES)]: '%H:%M'
	};
	function timeUnitSpecifier(units, specifiers) {
	  const s = extend({}, defaultSpecifiers, specifiers),
	        u = timeUnits(units),
	        n = u.length;
	  let fmt = '',
	      start = 0,
	      end,
	      key;

	  for (start = 0; start < n;) {
	    for (end = u.length; end > start; --end) {
	      key = u.slice(start, end).join('-');

	      if (s[key] != null) {
	        fmt += s[key];
	        start = end;
	        break;
	      }
	    }
	  }

	  return fmt.trim();
	}

	const t0$1 = new Date();

	function localYear(y) {
	  t0$1.setFullYear(y);
	  t0$1.setMonth(0);
	  t0$1.setDate(1);
	  t0$1.setHours(0, 0, 0, 0);
	  return t0$1;
	}

	function dayofyear(d) {
	  return localDayOfYear(new Date(d));
	}
	function week(d) {
	  return localWeekNum(new Date(d));
	}
	function localDayOfYear(d) {
	  return day.count(localYear(d.getFullYear()) - 1, d);
	}
	function localWeekNum(d) {
	  return sunday.count(localYear(d.getFullYear()) - 1, d);
	}
	function localFirst(y) {
	  return localYear(y).getDay();
	}
	function localDate(y, m, d, H, M, S, L) {
	  if (0 <= y && y < 100) {
	    const date = new Date(-1, m, d, H, M, S, L);
	    date.setFullYear(y);
	    return date;
	  }

	  return new Date(y, m, d, H, M, S, L);
	}
	function utcdayofyear(d) {
	  return utcDayOfYear(new Date(d));
	}
	function utcweek(d) {
	  return utcWeekNum(new Date(d));
	}
	function utcDayOfYear(d) {
	  const y = Date.UTC(d.getUTCFullYear(), 0, 1);
	  return utcDay.count(y - 1, d);
	}
	function utcWeekNum(d) {
	  const y = Date.UTC(d.getUTCFullYear(), 0, 1);
	  return utcSunday.count(y - 1, d);
	}
	function utcFirst(y) {
	  t0$1.setTime(Date.UTC(y, 0, 1));
	  return t0$1.getUTCDay();
	}
	function utcDate(y, m, d, H, M, S, L) {
	  if (0 <= y && y < 100) {
	    const date = new Date(Date.UTC(-1, m, d, H, M, S, L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }

	  return new Date(Date.UTC(y, m, d, H, M, S, L));
	}

	function floor(units, step, get, inv, newDate) {
	  const s = step || 1,
	        b = peek(units),
	        _ = (unit, p, key) => {
	    key = key || unit;
	    return getUnit(get[key], inv[key], unit === b && s, p);
	  };

	  const t = new Date(),
	        u = toSet(units),
	        y = u[YEAR] ? _(YEAR) : constant(2012),
	        m = u[MONTH] ? _(MONTH) : u[QUARTER] ? _(QUARTER) : zero,
	        d = u[WEEK] && u[DAY] ? _(DAY, 1, WEEK + DAY) : u[WEEK] ? _(WEEK, 1) : u[DAY] ? _(DAY, 1) : u[DATE] ? _(DATE, 1) : u[DAYOFYEAR] ? _(DAYOFYEAR, 1) : one,
	        H = u[HOURS] ? _(HOURS) : zero,
	        M = u[MINUTES] ? _(MINUTES) : zero,
	        S = u[SECONDS] ? _(SECONDS) : zero,
	        L = u[MILLISECONDS] ? _(MILLISECONDS) : zero;
	  return function (v) {
	    t.setTime(+v);
	    const year = y(t);
	    return newDate(year, m(t), d(t, year), H(t), M(t), S(t), L(t));
	  };
	}

	function getUnit(f, inv, step, phase) {
	  const u = step <= 1 ? f : phase ? (d, y) => phase + step * Math.floor((f(d, y) - phase) / step) : (d, y) => step * Math.floor(f(d, y) / step);
	  return inv ? (d, y) => inv(u(d, y), y) : u;
	} // returns the day of the year based on week number, day of week,
	// and the day of the week for the first day of the year


	function weekday$1(week, day, firstDay) {
	  return day + week * 7 - (firstDay + 6) % 7;
	} // -- LOCAL TIME --


	const localGet = {
	  [YEAR]: d => d.getFullYear(),
	  [QUARTER]: d => Math.floor(d.getMonth() / 3),
	  [MONTH]: d => d.getMonth(),
	  [DATE]: d => d.getDate(),
	  [HOURS]: d => d.getHours(),
	  [MINUTES]: d => d.getMinutes(),
	  [SECONDS]: d => d.getSeconds(),
	  [MILLISECONDS]: d => d.getMilliseconds(),
	  [DAYOFYEAR]: d => localDayOfYear(d),
	  [WEEK]: d => localWeekNum(d),
	  [WEEK + DAY]: (d, y) => weekday$1(localWeekNum(d), d.getDay(), localFirst(y)),
	  [DAY]: (d, y) => weekday$1(1, d.getDay(), localFirst(y))
	};
	const localInv = {
	  [QUARTER]: q => 3 * q,
	  [WEEK]: (w, y) => weekday$1(w, 0, localFirst(y))
	};
	function timeFloor(units, step) {
	  return floor(units, step || 1, localGet, localInv, localDate);
	} // -- UTC TIME --

	const utcGet = {
	  [YEAR]: d => d.getUTCFullYear(),
	  [QUARTER]: d => Math.floor(d.getUTCMonth() / 3),
	  [MONTH]: d => d.getUTCMonth(),
	  [DATE]: d => d.getUTCDate(),
	  [HOURS]: d => d.getUTCHours(),
	  [MINUTES]: d => d.getUTCMinutes(),
	  [SECONDS]: d => d.getUTCSeconds(),
	  [MILLISECONDS]: d => d.getUTCMilliseconds(),
	  [DAYOFYEAR]: d => utcDayOfYear(d),
	  [WEEK]: d => utcWeekNum(d),
	  [DAY]: (d, y) => weekday$1(1, d.getUTCDay(), utcFirst(y)),
	  [WEEK + DAY]: (d, y) => weekday$1(utcWeekNum(d), d.getUTCDay(), utcFirst(y))
	};
	const utcInv = {
	  [QUARTER]: q => 3 * q,
	  [WEEK]: (w, y) => weekday$1(w, 0, utcFirst(y))
	};
	function utcFloor(units, step) {
	  return floor(units, step || 1, utcGet, utcInv, utcDate);
	}

	const timeIntervals = {
	  [YEAR]: year,
	  [QUARTER]: month.every(3),
	  [MONTH]: month,
	  [WEEK]: sunday,
	  [DATE]: day,
	  [DAY]: day,
	  [DAYOFYEAR]: day,
	  [HOURS]: hour,
	  [MINUTES]: minute,
	  [SECONDS]: second,
	  [MILLISECONDS]: millisecond
	};
	const utcIntervals = {
	  [YEAR]: utcYear,
	  [QUARTER]: utcMonth.every(3),
	  [MONTH]: utcMonth,
	  [WEEK]: utcSunday,
	  [DATE]: utcDay,
	  [DAY]: utcDay,
	  [DAYOFYEAR]: utcDay,
	  [HOURS]: utcHour,
	  [MINUTES]: utcMinute,
	  [SECONDS]: second,
	  [MILLISECONDS]: millisecond
	};
	function timeInterval(unit) {
	  return timeIntervals[unit];
	}
	function utcInterval(unit) {
	  return utcIntervals[unit];
	}

	function offset(ival, date, step) {
	  return ival ? ival.offset(date, step) : undefined;
	}

	function timeOffset(unit, date, step) {
	  return offset(timeInterval(unit), date, step);
	}
	function utcOffset(unit, date, step) {
	  return offset(utcInterval(unit), date, step);
	}

	function sequence(ival, start, stop, step) {
	  return ival ? ival.range(start, stop, step) : undefined;
	}

	function timeSequence(unit, start, stop, step) {
	  return sequence(timeInterval(unit), start, stop, step);
	}
	function utcSequence(unit, start, stop, step) {
	  return sequence(utcInterval(unit), start, stop, step);
	}

	const durationSecond$1 = 1000,
	      durationMinute$1 = durationSecond$1 * 60,
	      durationHour$1 = durationMinute$1 * 60,
	      durationDay$1 = durationHour$1 * 24,
	      durationWeek$1 = durationDay$1 * 7,
	      durationMonth = durationDay$1 * 30,
	      durationYear = durationDay$1 * 365;
	const Milli = [YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS],
	      Seconds = Milli.slice(0, -1),
	      Minutes = Seconds.slice(0, -1),
	      Hours = Minutes.slice(0, -1),
	      Day = Hours.slice(0, -1),
	      Week = [YEAR, WEEK],
	      Month = [YEAR, MONTH],
	      Year = [YEAR];
	const intervals = [[Seconds, 1, durationSecond$1], [Seconds, 5, 5 * durationSecond$1], [Seconds, 15, 15 * durationSecond$1], [Seconds, 30, 30 * durationSecond$1], [Minutes, 1, durationMinute$1], [Minutes, 5, 5 * durationMinute$1], [Minutes, 15, 15 * durationMinute$1], [Minutes, 30, 30 * durationMinute$1], [Hours, 1, durationHour$1], [Hours, 3, 3 * durationHour$1], [Hours, 6, 6 * durationHour$1], [Hours, 12, 12 * durationHour$1], [Day, 1, durationDay$1], [Week, 1, durationWeek$1], [Month, 1, durationMonth], [Month, 3, 3 * durationMonth], [Year, 1, durationYear]];
	function bin$1 (opt) {
	  const ext = opt.extent,
	        max = opt.maxbins || 40,
	        target = Math.abs(span(ext)) / max;
	  let i = bisector(i => i[2]).right(intervals, target),
	      units,
	      step;

	  if (i === intervals.length) {
	    units = Year, step = tickStep(ext[0] / durationYear, ext[1] / durationYear, max);
	  } else if (i) {
	    i = intervals[target / intervals[i - 1][2] < intervals[i][2] / target ? i - 1 : i];
	    units = i[0];
	    step = i[1];
	  } else {
	    units = Milli;
	    step = Math.max(tickStep(ext[0], ext[1], max), 1);
	  }

	  return {
	    units,
	    step
	  };
	}

	var vegaTime_module = /*#__PURE__*/Object.freeze({
		__proto__: null,
		DATE: DATE,
		DAY: DAY,
		DAYOFYEAR: DAYOFYEAR,
		HOURS: HOURS,
		MILLISECONDS: MILLISECONDS,
		MINUTES: MINUTES,
		MONTH: MONTH,
		QUARTER: QUARTER,
		SECONDS: SECONDS,
		TIME_UNITS: TIME_UNITS,
		WEEK: WEEK,
		YEAR: YEAR,
		dayofyear: dayofyear,
		timeBin: bin$1,
		timeFloor: timeFloor,
		timeInterval: timeInterval,
		timeOffset: timeOffset,
		timeSequence: timeSequence,
		timeUnitSpecifier: timeUnitSpecifier,
		timeUnits: timeUnits,
		utcFloor: utcFloor,
		utcInterval: utcInterval,
		utcOffset: utcOffset,
		utcSequence: utcSequence,
		utcdayofyear: utcdayofyear,
		utcweek: utcweek,
		week: week
	});

	var bin_1 = /*@__PURE__*/getAugmentedNamespace(bin);

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(vegaTime_module);

	var schema = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PrimitiveType = exports.Schema = exports.build = void 0;
	const bins_1$1 = __importDefault(bins_1);




	const TYPE = __importStar(require$$1$1);
	const vegaTime = __importStar(require$$2);




	const dlBin = bins_1$1.default;
	/**
	 * Build a Schema object.
	 *
	 * @param data - a set of raw data in the same format that Vega-Lite / Vega takes
	 * Basically, it's an array in the form of:
	 *
	 * [
	 *   {a: 1, b:2},
	 *   {a: 2, b:3},
	 *   ...
	 * ]
	 *
	 * @return a Schema object
	 */
	function build(data, opt = {}, tableSchema = { fields: [] }) {
	    opt = util$1.extend({}, config.DEFAULT_QUERY_CONFIG, opt);
	    // create profiles for each variable
	    let summaries = stats_1.summary(data);
	    let types = type_1$1.inferAll(data); // inferAll does stronger type inference than summary
	    let tableSchemaFieldIndex = tableSchema.fields.reduce((m, field) => {
	        m[field.name] = field;
	        return m;
	    }, {});
	    let fieldSchemas = summaries.map(function (fieldProfile, index) {
	        const name = fieldProfile.field;
	        // In Table schema, 'date' doesn't include time so use 'datetime'
	        const type = types[name] === 'date' ? PrimitiveType.DATETIME : types[name];
	        let distinct = fieldProfile.distinct;
	        let vlType;
	        if (type === PrimitiveType.NUMBER) {
	            vlType = TYPE.QUANTITATIVE;
	        }
	        else if (type === PrimitiveType.INTEGER) {
	            // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
	            if (distinct < opt.numberNominalLimit && distinct / fieldProfile.count < opt.numberNominalProportion) {
	                vlType = TYPE.NOMINAL;
	            }
	            else {
	                vlType = TYPE.QUANTITATIVE;
	            }
	        }
	        else if (type === PrimitiveType.DATETIME) {
	            vlType = TYPE.TEMPORAL;
	            // need to get correct min/max of date data because datalib's summary method does not
	            // calculate this correctly for date types.
	            fieldProfile.min = new Date(data[0][name]);
	            fieldProfile.max = new Date(data[0][name]);
	            for (const dataEntry of data) {
	                const time = new Date(dataEntry[name]).getTime();
	                if (time < fieldProfile.min.getTime()) {
	                    fieldProfile.min = new Date(time);
	                }
	                if (time > fieldProfile.max.getTime()) {
	                    fieldProfile.max = new Date(time);
	                }
	            }
	        }
	        else {
	            vlType = TYPE.NOMINAL;
	        }
	        if (vlType === TYPE.NOMINAL &&
	            distinct / fieldProfile.count > opt.minPercentUniqueForKey &&
	            fieldProfile.count > opt.minCardinalityForKey) {
	            vlType = expandedtype.ExpandedType.KEY;
	        }
	        let fieldSchema = {
	            name: name,
	            // Need to keep original index for re-exporting TableSchema
	            originalIndex: index,
	            vlType: vlType,
	            type: type,
	            stats: fieldProfile,
	            timeStats: {},
	            binStats: {}
	        };
	        // extend field schema with table schema field - if present
	        const orgFieldSchema = tableSchemaFieldIndex[fieldSchema.name];
	        fieldSchema = util$1.extend(fieldSchema, orgFieldSchema);
	        return fieldSchema;
	    });
	    // calculate preset bins for quantitative and temporal data
	    for (let fieldSchema of fieldSchemas) {
	        if (fieldSchema.vlType === TYPE.QUANTITATIVE) {
	            for (let maxbins of opt.enum.binProps.maxbins) {
	                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
	            }
	        }
	        else if (fieldSchema.vlType === TYPE.TEMPORAL) {
	            for (let unit of opt.enum.timeUnit) {
	                if (unit !== undefined) {
	                    if (typeof unit === "object") {
	                        if ("unit" in unit) { // is TimeUnitParams
	                            fieldSchema.timeStats[unit.unit] = timeSummary(unit.unit, fieldSchema.stats);
	                        }
	                        else {
	                            throw new Error("Unrecognized TimeUnit type when calculating fieldSchema.stats");
	                        }
	                    }
	                    else {
	                        fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
	                    }
	                }
	            }
	        }
	    }
	    const derivedTableSchema = Object.assign(Object.assign({}, tableSchema), { fields: fieldSchemas });
	    return new Schema(derivedTableSchema);
	}
	exports.build = build;
	// order the field schema when we construct a new Schema
	// this orders the fields in the UI
	const order = {
	    nominal: 0,
	    key: 1,
	    ordinal: 2,
	    temporal: 3,
	    quantitative: 4
	};
	class Schema {
	    constructor(tableSchema) {
	        this._tableSchema = tableSchema;
	        tableSchema.fields.sort(function (a, b) {
	            // first order by vlType: nominal < temporal < quantitative < ordinal
	            if (order[a.vlType] < order[b.vlType]) {
	                return -1;
	            }
	            else if (order[a.vlType] > order[b.vlType]) {
	                return 1;
	            }
	            else {
	                // then order by field (alphabetically)
	                return a.name.localeCompare(b.name);
	            }
	        });
	        // Add index for sorting
	        tableSchema.fields.forEach((fieldSchema, index) => (fieldSchema.index = index));
	        this._fieldSchemaIndex = tableSchema.fields.reduce((m, fieldSchema) => {
	            m[fieldSchema.name] = fieldSchema;
	            return m;
	        }, {});
	    }
	    /** @return a list of the field names (for enumerating). */
	    fieldNames() {
	        return this._tableSchema.fields.map(fieldSchema => fieldSchema.name);
	    }
	    /** @return a list of FieldSchemas */
	    get fieldSchemas() {
	        return this._tableSchema.fields;
	    }
	    fieldSchema(fieldName) {
	        return this._fieldSchemaIndex[fieldName];
	    }
	    tableSchema() {
	        // the fieldschemas are re-arranged
	        // but this is not allowed in table schema.
	        // so we will re-order based on original index.
	        const tableSchema = util$1.duplicate(this._tableSchema);
	        tableSchema.fields.sort((a, b) => a.originalIndex - b.originalIndex);
	        return tableSchema;
	    }
	    /**
	     * @return primitive type of the field if exist, otherwise return null
	     */
	    primitiveType(fieldName) {
	        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].type : null;
	    }
	    /**
	     * @return vlType of measturement of the field if exist, otherwise return null
	     */
	    vlType(fieldName) {
	        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].vlType : null;
	    }
	    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
	     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
	     */
	    cardinality(fieldQ, augmentTimeUnitDomain = true, excludeInvalid = false) {
	        const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
	        if (fieldQ.aggregate || (encoding.isAutoCountQuery(fieldQ) && fieldQ.autoCount)) {
	            return 1;
	        }
	        else if (fieldQ.bin) {
	            // encQ.bin will either be a boolean or a BinQuery
	            let bin;
	            if (typeof fieldQ.bin === 'boolean') {
	                // autoMaxBins defaults to 10 if channel is Wildcard
	                bin = {
	                    maxbins: bin_1.autoMaxBins(fieldQ.channel)
	                };
	            }
	            else if (fieldQ.bin === '?') {
	                bin = {
	                    enum: [true, false]
	                };
	            }
	            else {
	                bin = fieldQ.bin;
	            }
	            const maxbins = bin.maxbins;
	            if (!fieldSchema.binStats[maxbins]) {
	                // need to calculate
	                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
	            }
	            // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
	            return fieldSchema.binStats[maxbins].distinct;
	        }
	        else if (fieldQ.timeUnit) {
	            if (augmentTimeUnitDomain) {
	                switch (fieldQ.timeUnit) {
	                    // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
	                    case vegaTime.SECONDS:
	                        return 60;
	                    case vegaTime.MINUTES:
	                        return 60;
	                    case vegaTime.HOURS:
	                        return 24;
	                    case vegaTime.DAY:
	                        return 7;
	                    case vegaTime.DATE:
	                        return 31;
	                    case vegaTime.MONTH:
	                        return 12;
	                    case vegaTime.QUARTER:
	                        return 4;
	                    case vegaTime.MILLISECONDS:
	                        return 1000;
	                }
	            }
	            let unit = fieldQ.timeUnit;
	            let timeStats = fieldSchema.timeStats;
	            // if the cardinality for the timeUnit is not cached, calculate it
	            if (!timeStats || !timeStats[unit]) {
	                timeStats = Object.assign(Object.assign({}, timeStats), { [unit]: timeSummary(fieldQ.timeUnit, fieldSchema.stats) });
	            }
	            if (excludeInvalid) {
	                return timeStats[unit].distinct - invalidCount(timeStats[unit].unique, ['Invalid Date', null]);
	            }
	            else {
	                return timeStats[unit].distinct;
	            }
	        }
	        else {
	            if (fieldSchema) {
	                if (excludeInvalid) {
	                    return fieldSchema.stats.distinct - invalidCount(fieldSchema.stats.unique, [NaN, null]);
	                }
	                else {
	                    return fieldSchema.stats.distinct;
	                }
	            }
	            else {
	                return null;
	            }
	        }
	    }
	    /**
	     * Given an EncodingQuery with a timeUnit, returns true if the date field
	     * has multiple distinct values for all parts of the timeUnit. Returns undefined
	     * if the timeUnit is undefined.
	     * i.e.
	     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
	     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
	     */
	    timeUnitHasVariation(fieldQ) {
	        if (!fieldQ.timeUnit) {
	            return;
	        }
	        // if there is no variation in `date`, there should not be variation in `day`
	        if (fieldQ.timeUnit === vegaTime.DAY) {
	            const dateEncQ = util$1.extend({}, fieldQ, { timeUnit: vegaTime.DATE });
	            if (this.cardinality(dateEncQ, false, true) <= 1) {
	                return false;
	            }
	        }
	        let fullTimeUnit = fieldQ.timeUnit;
	        for (let timeUnitPart of timeunit_1.TIMEUNIT_PARTS) {
	            if (timeunit_1.containsTimeUnit(fullTimeUnit, timeUnitPart)) {
	                // Create a clone of encQ, but with singleTimeUnit
	                const singleUnitEncQ = util$1.extend({}, fieldQ, { timeUnit: timeUnitPart });
	                if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }
	    domain(fieldQueryParts) {
	        // TODO: differentiate for field with bin / timeUnit
	        const fieldSchema = this._fieldSchemaIndex[fieldQueryParts.field];
	        let domain = util$1.keys(fieldSchema.stats.unique);
	        if (fieldSchema.vlType === TYPE.QUANTITATIVE) {
	            // return [min, max], coerced into number types
	            return [+fieldSchema.stats.min, +fieldSchema.stats.max];
	        }
	        else if (fieldSchema.type === PrimitiveType.DATETIME) {
	            // return [min, max] dates
	            return [fieldSchema.stats.min, fieldSchema.stats.max];
	        }
	        else if (fieldSchema.type === PrimitiveType.INTEGER || fieldSchema.type === PrimitiveType.NUMBER) {
	            // coerce non-quantitative numerical data into number type
	            domain = domain.map(x => +x);
	            return domain.sort(util$1.cmp);
	        }
	        else if (fieldSchema.vlType === TYPE.ORDINAL && fieldSchema.ordinalDomain) {
	            return fieldSchema.ordinalDomain;
	        }
	        return domain
	            .map(x => {
	            // Convert 'null' to null as it is encoded similarly in datalib.
	            // This is wrong when it is a string 'null' but that rarely happens.
	            return x === 'null' ? null : x;
	        })
	            .sort(util$1.cmp);
	    }
	    /**
	     * @return a Summary corresponding to the field of the given EncodingQuery
	     */
	    stats(fieldQ) {
	        // TODO: differentiate for field with bin / timeUnit vs without
	        const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
	        return fieldSchema ? fieldSchema.stats : null;
	    }
	}
	exports.Schema = Schema;
	/**
	 * @return a summary of the binning scheme determined from the given max number of bins
	 */
	function binSummary(maxbins, summary) {
	    const bin = dlBin({
	        min: summary.min,
	        max: summary.max,
	        maxbins: maxbins
	    });
	    // start with summary, pre-binning
	    const result = util$1.extend({}, summary);
	    result.unique = binUnique(bin, summary.unique);
	    result.distinct = (bin.stop - bin.start) / bin.step;
	    result.min = bin.start;
	    result.max = bin.stop;
	    return result;
	}
	const SET_DATE_METHOD = {
	    year: 'setFullYear',
	    month: 'setMonth',
	    date: 'setDate',
	    hours: 'setHours',
	    minutes: 'setMinutes',
	    seconds: 'setSeconds',
	    milliseconds: 'setMilliseconds',
	    // the units below have their own special cases
	    dayofyear: null,
	    week: null,
	    quarter: null,
	    day: null
	};
	function dateMethods(singleUnit, isUtc) {
	    const rawSetDateMethod = SET_DATE_METHOD[singleUnit];
	    const setDateMethod = isUtc ? `setUTC${rawSetDateMethod.substr(3)}` : rawSetDateMethod;
	    const getDateMethod = `get${isUtc ? 'UTC' : ''}${rawSetDateMethod.substr(3)}`;
	    return { setDateMethod, getDateMethod };
	}
	function convert(unit, date) {
	    const isUTC = timeunit_1.isUTCTimeUnit(unit);
	    const result = isUTC
	        ? // start with uniform date
	            new Date(Date.UTC(1972, 0, 1, 0, 0, 0, 0)) // 1972 is the first leap year after 1970, the start of unix time
	        : new Date(1972, 0, 1, 0, 0, 0, 0);
	    for (const timeUnitPart of timeunit_1.TIMEUNIT_PARTS) {
	        if (timeunit_1.containsTimeUnit(unit, timeUnitPart)) {
	            switch (timeUnitPart) {
	                case vegaTime.DAY:
	                    throw new Error("Cannot convert to TimeUnits containing 'day'");
	                case vegaTime.DAYOFYEAR:
	                    throw new Error("Cannot convert to TimeUnits containing 'dayofyear'");
	                case vegaTime.WEEK:
	                    throw new Error("Cannot convert to TimeUnits containing 'week'");
	                case vegaTime.QUARTER: {
	                    const { getDateMethod, setDateMethod } = dateMethods('month', isUTC);
	                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
	                    result[setDateMethod](Math.floor(date[getDateMethod]() / 3) * 3);
	                    break;
	                }
	                default: {
	                    const { getDateMethod, setDateMethod } = dateMethods(timeUnitPart, isUTC);
	                    result[setDateMethod](date[getDateMethod]());
	                }
	            }
	        }
	    }
	    return result;
	}
	/** @return a modified version of the passed summary with unique and distinct set according to the timeunit.
	 *  Maps 'null' (string) keys to the null value and invalid dates to 'Invalid Date' in the unique dictionary.
	 */
	function timeSummary(timeunit, summary) {
	    const result = util$1.extend({}, summary);
	    let unique = {};
	    util$1.keys(summary.unique).forEach(function (dateString) {
	        // don't convert null value because the Date constructor will actually convert it to a date
	        let date = dateString === 'null' ? null : new Date(dateString);
	        // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
	        let key;
	        if (date === null) {
	            key = null;
	        }
	        else if (isNaN(date.getTime())) {
	            key = 'Invalid Date';
	        }
	        else {
	            key = (timeunit === vegaTime.DAY ? date.getDay() : convert(timeunit, date)).toString();
	        }
	        unique[key] = (unique[key] || 0) + summary.unique[dateString];
	    });
	    result.unique = unique;
	    result.distinct = util$1.keys(unique).length;
	    return result;
	}
	/**
	 * @return a new unique object based off of the old unique count and a binning scheme
	 */
	function binUnique(bin, oldUnique) {
	    const newUnique = {};
	    for (let value in oldUnique) {
	        let bucket;
	        if (value === null) {
	            bucket = null;
	        }
	        else if (isNaN(Number(value))) {
	            bucket = NaN;
	        }
	        else {
	            bucket = bin.value(Number(value));
	        }
	        newUnique[bucket] = (newUnique[bucket] || 0) + oldUnique[value];
	    }
	    return newUnique;
	}
	/** @return the number of items in list that occur as keys of unique */
	function invalidCount(unique, list) {
	    return list.reduce(function (prev, cur) {
	        return unique[cur] ? prev + 1 : prev;
	    }, 0);
	}
	var PrimitiveType;
	(function (PrimitiveType) {
	    PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
	    PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
	    PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
	    PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
	    PrimitiveType[PrimitiveType["DATETIME"] = 'datetime'] = "DATETIME";
	})(PrimitiveType = exports.PrimitiveType || (exports.PrimitiveType = {}));

	});

	var base = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EncodingConstraintModel = exports.AbstractConstraintModel = void 0;



	/**
	 * Abstract model for a constraint.
	 */
	class AbstractConstraintModel {
	    constructor(constraint) {
	        this.constraint = constraint;
	    }
	    name() {
	        return this.constraint.name;
	    }
	    description() {
	        return this.constraint.description;
	    }
	    properties() {
	        return this.constraint.properties;
	    }
	    strict() {
	        return this.constraint.strict;
	    }
	}
	exports.AbstractConstraintModel = AbstractConstraintModel;
	class EncodingConstraintModel extends AbstractConstraintModel {
	    constructor(constraint) {
	        super(constraint);
	    }
	    hasAllRequiredPropertiesSpecific(encQ) {
	        return util$1.every(this.constraint.properties, (prop) => {
	            if (property.isEncodingNestedProp(prop)) {
	                let parent = prop.parent;
	                let child = prop.child;
	                if (!encQ[parent]) {
	                    return true;
	                }
	                return !wildcard.isWildcard(encQ[parent][child]);
	            }
	            if (!encQ[prop]) {
	                return true;
	            }
	            return !wildcard.isWildcard(encQ[prop]);
	        });
	    }
	    satisfy(encQ, schema, encWildcardIndex, opt) {
	        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
	        if (!this.constraint.allowWildcardForProperties) {
	            // TODO: extract as a method and do unit test
	            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
	                return true;
	            }
	        }
	        return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
	    }
	}
	exports.EncodingConstraintModel = EncodingConstraintModel;

	});

	var field$1 = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FIELD_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINT_INDEX = exports.FIELD_CONSTRAINTS = void 0;
	const CHANNEL = __importStar(require$$0);



	const TYPE = __importStar(require$$1$1);








	exports.FIELD_CONSTRAINTS = [
	    {
	        name: 'aggregateOpSupportedByType',
	        description: 'Aggregate function should be supported by data type.',
	        properties: [property.Property.TYPE, property.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.aggregate) {
	                return !expandedtype.isDiscrete(fieldQ.type);
	            }
	            // TODO: some aggregate function are actually supported by ordinal
	            return true; // no aggregate is okay with any type.
	        }
	    },
	    {
	        name: 'asteriskFieldWithCountOnly',
	        description: 'Field="*" should be disallowed except aggregate="count"',
	        properties: [property.Property.FIELD, property.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
	        }
	    },
	    {
	        name: 'minCardinalityForBin',
	        description: 'binned quantitative field should not have too low cardinality',
	        properties: [property.Property.BIN, property.Property.FIELD, property.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, schema, _, opt) => {
	            if (fieldQ.bin && fieldQ.type === TYPE.QUANTITATIVE) {
	                // We remove bin so schema can infer the raw unbinned cardinality.
	                let fieldQwithoutBin = {
	                    channel: fieldQ.channel,
	                    field: fieldQ.field,
	                    type: fieldQ.type
	                };
	                return schema.cardinality(fieldQwithoutBin) >= opt.minCardinalityForBin;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'binAppliedForQuantitative',
	        description: 'bin should be applied to quantitative field only.',
	        properties: [property.Property.TYPE, property.Property.BIN],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.bin) {
	                // If binned, the type must be quantitative
	                return fieldQ.type === TYPE.QUANTITATIVE;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'channelFieldCompatible',
	        description: `encoding channel's range type be compatible with channel type.`,
	        properties: [property.Property.CHANNEL, property.Property.TYPE, property.Property.BIN, property.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
	            var _a;
	            const fieldDef = Object.assign({ field: 'f' }, encoding.toFieldDef(fieldQ, { schema, props: ['bin', 'timeUnit', 'type'] }));
	            const { compatible } = channeldef_1.channelCompatibility(fieldDef, fieldQ.channel);
	            if (compatible) {
	                return true;
	            }
	            else {
	                // In VL, facet's field def must be discrete (O/N), but in CompassQL we can relax this a bit.
	                const isFacet = fieldQ.channel === 'row' || fieldQ.channel === 'column' || fieldQ.channel === 'facet';
	                const unit = fieldDef.timeUnit && ((_a = timeunit_1.normalizeTimeUnit(fieldDef.timeUnit)) === null || _a === void 0 ? void 0 : _a.unit);
	                if (isFacet && unit && (timeunit_1.isLocalSingleTimeUnit(unit) || timeunit_1.isUTCTimeUnit(unit))) {
	                    return true;
	                }
	                return false;
	            }
	        }
	    },
	    {
	        name: 'hasFn',
	        description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
	        properties: [property.Property.AGGREGATE, property.Property.BIN, property.Property.TIMEUNIT],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.hasFn) {
	                return !!fieldQ.aggregate || !!fieldQ.bin || !!fieldQ.timeUnit;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitScaleZeroWithBinnedField',
	        description: 'Do not use scale zero with binned field',
	        properties: [property.Property.SCALE, property.getEncodingNestedProp('scale', 'zero'), property.Property.BIN],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.bin && fieldQ.scale) {
	                if (fieldQ.scale.zero === true) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'onlyOneTypeOfFunction',
	        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
	        properties: [property.Property.AGGREGATE, property.Property.AUTOCOUNT, property.Property.TIMEUNIT, property.Property.BIN],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (encoding.isFieldQuery(fieldQ)) {
	                const numFn = (!wildcard.isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
	                    (!wildcard.isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
	                    (!wildcard.isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
	                return numFn <= 1;
	            }
	            // For autoCount there is always only one type of function
	            return true;
	        }
	    },
	    {
	        name: 'timeUnitAppliedForTemporal',
	        description: 'Time unit should be applied to temporal field only.',
	        properties: [property.Property.TYPE, property.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.timeUnit && fieldQ.type !== TYPE.TEMPORAL) {
	                return false;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'timeUnitShouldHaveVariation',
	        description: 'A particular time unit should be applied only if they produce unique values.',
	        properties: [property.Property.TIMEUNIT, property.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
	            if (fieldQ.timeUnit && fieldQ.type === TYPE.TEMPORAL) {
	                if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
	                    // Do not have to check this as this is manually specified by users.
	                    return true;
	                }
	                return schema.timeUnitHasVariation(fieldQ);
	            }
	            return true;
	        }
	    },
	    {
	        name: 'scalePropertiesSupportedByScaleType',
	        description: 'Scale properties must be supported by correct scale type',
	        properties: [].concat(property.SCALE_PROPS, [property.Property.SCALE, property.Property.TYPE]),
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.scale) {
	                const scale = fieldQ.scale;
	                //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
	                //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
	                //  what the scale type is, and thus can ignore the constraint.
	                const sType = encoding.scaleType(fieldQ);
	                if (sType === undefined || sType === null) {
	                    // If still ambiguous, doesn't check the constraint
	                    return true;
	                }
	                for (let scaleProp in scale) {
	                    if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
	                        // ignore type and properties of wildcards
	                        continue;
	                    }
	                    const sProp = scaleProp;
	                    if (sType === 'point') {
	                        // HACK: our current implementation of scaleType() can return point
	                        // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
	                        if (!scale_1.scaleTypeSupportProperty('point', sProp) && !scale_1.scaleTypeSupportProperty('band', sProp)) {
	                            return false;
	                        }
	                    }
	                    else if (!scale_1.scaleTypeSupportProperty(sType, sProp)) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'scalePropertiesSupportedByChannel',
	        description: 'Not all scale properties are supported by all encoding channels',
	        properties: [].concat(property.SCALE_PROPS, [property.Property.SCALE, property.Property.CHANNEL]),
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ) {
	                let channel = fieldQ.channel;
	                let scale = fieldQ.scale;
	                if (channel && !wildcard.isWildcard(channel) && scale) {
	                    if (channel === 'row' || channel === 'column' || channel === 'facet') {
	                        // row / column do not have scale
	                        return false;
	                    }
	                    for (let scaleProp in scale) {
	                        if (!scale.hasOwnProperty(scaleProp))
	                            continue;
	                        if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
	                            // ignore type and properties of wildcards
	                            continue;
	                        }
	                        let isSupported = scale_1.channelScalePropertyIncompatability(channel, scaleProp) === undefined;
	                        if (!isSupported) {
	                            return false;
	                        }
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'typeMatchesPrimitiveType',
	        description: "Data type should be supported by field's primitive type.",
	        properties: [property.Property.FIELD, property.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, schema$1, encWildcardIndex, opt) => {
	            if (fieldQ.field === '*') {
	                return true;
	            }
	            const primitiveType = schema$1.primitiveType(fieldQ.field);
	            const type = fieldQ.type;
	            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
	                // Do not have to check this as this is manually specified by users.
	                return true;
	            }
	            switch (primitiveType) {
	                case schema.PrimitiveType.BOOLEAN:
	                case schema.PrimitiveType.STRING:
	                    return type !== TYPE.QUANTITATIVE && type !== TYPE.TEMPORAL;
	                case schema.PrimitiveType.NUMBER:
	                case schema.PrimitiveType.INTEGER:
	                    return type !== TYPE.TEMPORAL;
	                case schema.PrimitiveType.DATETIME:
	                    // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
	                    return type === TYPE.TEMPORAL;
	                case null:
	                    // field does not exist in the schema
	                    return false;
	            }
	            throw new Error('Not implemented');
	        }
	    },
	    {
	        name: 'typeMatchesSchemaType',
	        description: "Enumerated data type of a field should match the field's type in the schema.",
	        properties: [property.Property.FIELD, property.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
	            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
	                // Do not have to check this as this is manually specified by users.
	                return true;
	            }
	            if (fieldQ.field === '*') {
	                return fieldQ.type === TYPE.QUANTITATIVE;
	            }
	            return schema.vlType(fieldQ.field) === fieldQ.type;
	        }
	    },
	    {
	        name: 'maxCardinalityForCategoricalColor',
	        description: 'Categorical channel should not have too high cardinality',
	        properties: [property.Property.CHANNEL, property.Property.FIELD],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (fieldQ, schema, _, opt) => {
	            // TODO: missing case where ordinal / temporal use categorical color
	            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
	            if (fieldQ.channel === CHANNEL.COLOR && (fieldQ.type === TYPE.NOMINAL || fieldQ.type === expandedtype.ExpandedType.KEY)) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    },
	    {
	        name: 'maxCardinalityForFacet',
	        description: 'Row/column channel should not have too high cardinality',
	        properties: [property.Property.CHANNEL, property.Property.FIELD, property.Property.BIN, property.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (fieldQ, schema, _, opt) => {
	            if (fieldQ.channel === CHANNEL.ROW || fieldQ.channel === CHANNEL.COLUMN) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForFacet;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    },
	    {
	        name: 'maxCardinalityForShape',
	        description: 'Shape channel should not have too high cardinality',
	        properties: [property.Property.CHANNEL, property.Property.FIELD, property.Property.BIN, property.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (fieldQ, schema, _, opt) => {
	            if (fieldQ.channel === CHANNEL.SHAPE) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForShape;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    },
	    {
	        name: 'dataTypeAndFunctionMatchScaleType',
	        description: 'Scale type must match data type',
	        properties: [
	            property.Property.TYPE,
	            property.Property.SCALE,
	            property.getEncodingNestedProp('scale', 'type'),
	            property.Property.TIMEUNIT,
	            property.Property.BIN
	        ],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (fieldQ.scale) {
	                const type = fieldQ.type;
	                const sType = encoding.scaleType(fieldQ);
	                if (expandedtype.isDiscrete(type)) {
	                    return sType === undefined || scale_1.hasDiscreteDomain(sType);
	                }
	                else if (type === TYPE.TEMPORAL) {
	                    if (!fieldQ.timeUnit) {
	                        return util$1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType);
	                    }
	                    else {
	                        return util$1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType) || scale_1.hasDiscreteDomain(sType);
	                    }
	                }
	                else if (type === TYPE.QUANTITATIVE) {
	                    if (fieldQ.bin) {
	                        return util$1.contains([scale_1.ScaleType.LINEAR, undefined], sType);
	                    }
	                    else {
	                        return util$1.contains([
	                            scale_1.ScaleType.LOG,
	                            scale_1.ScaleType.POW,
	                            scale_1.ScaleType.SQRT,
	                            scale_1.ScaleType.QUANTILE,
	                            scale_1.ScaleType.QUANTIZE,
	                            scale_1.ScaleType.LINEAR,
	                            undefined
	                        ], sType);
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'stackIsOnlyUsedWithXY',
	        description: 'stack should only be allowed for x and y channels',
	        properties: [property.Property.STACK, property.Property.CHANNEL],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (fieldQ, _, __, ___) => {
	            if (!!fieldQ.stack) {
	                return fieldQ.channel === CHANNEL.X || fieldQ.channel === CHANNEL.Y;
	            }
	            return true;
	        }
	    }
	].map((ec) => new base.EncodingConstraintModel(ec));
	exports.FIELD_CONSTRAINT_INDEX = exports.FIELD_CONSTRAINTS.reduce((m, ec) => {
	    m[ec.name()] = ec;
	    return m;
	}, {});
	exports.FIELD_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINTS.reduce((index, c) => {
	    for (const prop of c.properties()) {
	        // Initialize array and use it
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex.PropIndex());

	});

	var value$2 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VALUE_CONSTRAINTS_BY_PROPERTY = exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS = void 0;




	exports.VALUE_CONSTRAINTS = [
	    {
	        name: 'doesNotSupportConstantValue',
	        description: 'row, column, x, y, order, and detail should not work with constant values.',
	        properties: [property.Property.TYPE, property.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (valueQ, _, __, ___) => {
	            return !(util$1.contains(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
	        }
	    }
	].map((ec) => new base.EncodingConstraintModel(ec));
	exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS.reduce((m, ec) => {
	    m[ec.name()] = ec;
	    return m;
	}, {});
	exports.VALUE_CONSTRAINTS_BY_PROPERTY = exports.VALUE_CONSTRAINTS.reduce((index, c) => {
	    for (const prop of c.properties()) {
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex.PropIndex());

	});

	var encoding$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkEncoding = void 0;



	/**
	 * Check all encoding constraints for a particular property and index tuple
	 */
	function checkEncoding(prop, wildcard, index, specM, schema, opt) {
	    // Check encoding constraint
	    const encodingConstraints = field$1.FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    const encQ = specM.getEncodingQueryByIndex(index);
	    for (const c of encodingConstraints) {
	        // Check if the constraint is enabled
	        if (c.strict() || !!opt[c.name()]) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
	            if (!satisfy) {
	                let violatedConstraint = `(enc) ${c.name()}`;
	                /* istanbul ignore if */
	                if (opt.verbose) {
	                    console.log(`${violatedConstraint} failed with ${specM.toShorthand()} for ${wildcard.name}`);
	                }
	                return violatedConstraint;
	            }
	        }
	    }
	    const valueContraints = value$2.VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    for (const c of valueContraints) {
	        // Check if the constraint is enabled
	        if ((c.strict() || !!opt[c.name()]) && encoding.isValueQuery(encQ)) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
	            if (!satisfy) {
	                let violatedConstraint = `(enc) ${c.name()}`;
	                /* istanbul ignore if */
	                if (opt.verbose) {
	                    console.log(`${violatedConstraint} failed with ${specM.toShorthand()} for ${wildcard.name}`);
	                }
	                return violatedConstraint;
	            }
	        }
	    }
	    return null;
	}
	exports.checkEncoding = checkEncoding;

	});

	var spec$1 = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkSpec = exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS = exports.SpecConstraintModel = void 0;

	const CHANNEL = __importStar(require$$0);
	const channel_1 = require$$0;
	const MARK = __importStar(require$$1);

	const TYPE = __importStar(require$$1$1);







	const NONPOSITION_CHANNELS_INDEX = channel_1.NONPOSITION_CHANNELS.reduce((m, channel) => {
	    m[channel] = true;
	    return m;
	}, {});
	class SpecConstraintModel extends base.AbstractConstraintModel {
	    constructor(specConstraint) {
	        super(specConstraint);
	    }
	    hasAllRequiredPropertiesSpecific(specM) {
	        return util$1.every(this.constraint.properties, prop => {
	            if (prop === property.Property.MARK) {
	                return !wildcard.isWildcard(specM.getMark());
	            }
	            // TODO: transform
	            if (property.isEncodingNestedProp(prop)) {
	                let parent = prop.parent;
	                let child = prop.child;
	                return util$1.every(specM.getEncodings(), encQ => {
	                    if (!encQ[parent]) {
	                        return true;
	                    }
	                    return !wildcard.isWildcard(encQ[parent][child]);
	                });
	            }
	            if (!property.isEncodingProperty(prop)) {
	                throw new Error('UNIMPLEMENTED');
	            }
	            return util$1.every(specM.getEncodings(), encQ => {
	                if (!encQ[prop]) {
	                    return true;
	                }
	                return !wildcard.isWildcard(encQ[prop]);
	            });
	        });
	    }
	    satisfy(specM, schema, opt) {
	        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
	        if (!this.constraint.allowWildcardForProperties) {
	            if (!this.hasAllRequiredPropertiesSpecific(specM)) {
	                return true;
	            }
	        }
	        return this.constraint.satisfy(specM, schema, opt);
	    }
	}
	exports.SpecConstraintModel = SpecConstraintModel;
	exports.SPEC_CONSTRAINTS = [
	    {
	        name: 'noRepeatedChannel',
	        description: 'Each encoding channel should only be used once.',
	        properties: [property.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            let usedChannel = {};
	            // channel for all encodings should be valid
	            return util$1.every(specM.getEncodings(), encQ => {
	                if (!wildcard.isWildcard(encQ.channel)) {
	                    // If channel is specified, it should no be used already
	                    if (usedChannel[encQ.channel]) {
	                        return false;
	                    }
	                    usedChannel[encQ.channel] = true;
	                    return true;
	                }
	                return true; // unspecified channel is valid
	            });
	        }
	    },
	    {
	        name: 'alwaysIncludeZeroInScaleWithBarMark',
	        description: 'Do not recommend bar mark if scale does not start at zero',
	        properties: [
	            property.Property.MARK,
	            property.Property.SCALE,
	            property.getEncodingNestedProp('scale', 'zero'),
	            property.Property.CHANNEL,
	            property.Property.TYPE
	        ],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            const mark = specM.getMark();
	            const encodings = specM.getEncodings();
	            if (mark === MARK.BAR) {
	                for (let encQ of encodings) {
	                    if (encoding.isFieldQuery(encQ) &&
	                        (encQ.channel === CHANNEL.X || encQ.channel === CHANNEL.Y) &&
	                        encQ.type === TYPE.QUANTITATIVE &&
	                        (encQ.scale && encQ.scale.zero === false)) {
	                        // TODO: zero shouldn't be manually specified
	                        return false;
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'autoAddCount',
	        description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunit fields.',
	        properties: [property.Property.BIN, property.Property.TIMEUNIT, property.Property.TYPE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            const hasAutoCount = util$1.some(specM.getEncodings(), (encQ) => encoding.isEnabledAutoCountQuery(encQ));
	            if (hasAutoCount) {
	                // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
	                return util$1.every(specM.getEncodings(), (encQ) => {
	                    if (encoding.isValueQuery(encQ)) {
	                        return true;
	                    }
	                    if (encoding.isAutoCountQuery(encQ)) {
	                        return true;
	                    }
	                    switch (encQ.type) {
	                        case TYPE.QUANTITATIVE:
	                            return !!encQ.bin;
	                        case TYPE.TEMPORAL:
	                            return !!encQ.timeUnit;
	                        case TYPE.ORDINAL:
	                        case expandedtype.ExpandedType.KEY:
	                        case TYPE.NOMINAL:
	                            return true;
	                    }
	                    /* istanbul ignore next */
	                    throw new Error('Unsupported Type');
	                });
	            }
	            else {
	                const autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
	                const neverHaveAutoCount = util$1.every(autoCountEncIndex, (index) => {
	                    let encQ = specM.getEncodingQueryByIndex(index);
	                    return encoding.isAutoCountQuery(encQ) && !wildcard.isWildcard(encQ.autoCount);
	                });
	                if (neverHaveAutoCount) {
	                    // If the query surely does not have autoCount
	                    // then one of the field should be
	                    // (1) unbinned quantitative
	                    // (2) temporal without time unit
	                    // (3) nominal or ordinal field
	                    // or at least have potential to be (still ambiguous).
	                    return util$1.some(specM.getEncodings(), (encQ) => {
	                        if ((encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) && encQ.type === TYPE.QUANTITATIVE) {
	                            if (encoding.isDisabledAutoCountQuery(encQ)) {
	                                return false;
	                            }
	                            else {
	                                return encoding.isFieldQuery(encQ) && (!encQ.bin || wildcard.isWildcard(encQ.bin));
	                            }
	                        }
	                        else if (encoding.isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
	                            return !encQ.timeUnit || wildcard.isWildcard(encQ.timeUnit);
	                        }
	                        return false; // nominal or ordinal
	                    });
	                }
	            }
	            return true; // no auto count, no constraint
	        }
	    },
	    {
	        name: 'channelPermittedByMarkType',
	        description: 'Each encoding channel should be supported by the mark type',
	        properties: [property.Property.CHANNEL, property.Property.MARK],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            const mark = specM.getMark();
	            // if mark is unspecified, no need to check
	            if (wildcard.isWildcard(mark))
	                return true;
	            // TODO: can optimize this to detect only what's the changed property if needed.
	            return util$1.every(specM.getEncodings(), encQ => {
	                // channel unspecified, no need to check
	                if (wildcard.isWildcard(encQ.channel))
	                    return true;
	                if (encQ.channel === 'row' || encQ.channel === 'column' || encQ.channel === 'facet')
	                    return true;
	                return !!channel_1.supportMark(encQ.channel, mark);
	            });
	        }
	    },
	    {
	        name: 'hasAllRequiredChannelsForMark',
	        description: 'All required channels for the specified mark should be specified',
	        properties: [property.Property.CHANNEL, property.Property.MARK],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            const mark = specM.getMark();
	            switch (mark) {
	                case MARK.AREA:
	                case MARK.LINE:
	                    return specM.channelUsed(CHANNEL.X) && specM.channelUsed(CHANNEL.Y);
	                case MARK.TEXT:
	                    return specM.channelUsed(CHANNEL.TEXT);
	                case MARK.BAR:
	                case MARK.CIRCLE:
	                case MARK.SQUARE:
	                case MARK.TICK:
	                case MARK.RULE:
	                case MARK.RECT:
	                    return specM.channelUsed(CHANNEL.X) || specM.channelUsed(CHANNEL.Y);
	                case MARK.POINT:
	                    // This allows generating a point plot if channel was not a wildcard.
	                    return (!specM.wildcardIndex.hasProperty(property.Property.CHANNEL) ||
	                        specM.channelUsed(CHANNEL.X) ||
	                        specM.channelUsed(CHANNEL.Y));
	            }
	            /* istanbul ignore next */
	            throw new Error(`hasAllRequiredChannelsForMark not implemented for mark${JSON.stringify(mark)}`);
	        }
	    },
	    {
	        name: 'omitAggregate',
	        description: 'Omit aggregate plots.',
	        properties: [property.Property.AGGREGATE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            if (specM.isAggregate()) {
	                return false;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
	        description: 'Omit aggregate plots with dimensions only on facets as that leads to inefficient use of space.',
	        properties: [property.Property.CHANNEL, property.Property.AGGREGATE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            if (specM.isAggregate()) {
	                let hasNonFacetDim = false;
	                let hasDim = false;
	                let hasEnumeratedFacetDim = false;
	                specM.specQuery.encodings.forEach((encQ, index) => {
	                    if (encoding.isValueQuery(encQ) || encoding.isDisabledAutoCountQuery(encQ))
	                        return; // skip unused field
	                    // FieldQuery & !encQ.aggregate
	                    if (encoding.isFieldQuery(encQ) && !encQ.aggregate) {
	                        // isDimension
	                        hasDim = true;
	                        if (util$1.contains([CHANNEL.ROW, CHANNEL.COLUMN], encQ.channel)) {
	                            if (specM.wildcardIndex.hasEncodingProperty(index, property.Property.CHANNEL)) {
	                                hasEnumeratedFacetDim = true;
	                            }
	                        }
	                        else {
	                            hasNonFacetDim = true;
	                        }
	                    }
	                });
	                if (hasDim && !hasNonFacetDim) {
	                    if (hasEnumeratedFacetDim || opt.constraintManuallySpecifiedValue) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitAggregatePlotWithoutDimension',
	        description: 'Aggregate plots without dimension should be omitted',
	        properties: [property.Property.AGGREGATE, property.Property.AUTOCOUNT, property.Property.BIN, property.Property.TIMEUNIT, property.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            if (specM.isAggregate()) {
	                // TODO relax
	                return util$1.some(specM.getEncodings(), (encQ) => {
	                    if (encoding.isDimension(encQ) || (encoding.isFieldQuery(encQ) && encQ.type === 'temporal')) {
	                        return true;
	                    }
	                    return false;
	                });
	            }
	            return true;
	        }
	    },
	    {
	        // TODO: we can be smarter and check if bar has occlusion based on profiling statistics
	        name: 'omitBarLineAreaWithOcclusion',
	        description: "Don't use bar, line or area to visualize raw plot as they often lead to occlusion.",
	        properties: [property.Property.MARK, property.Property.AGGREGATE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            if (util$1.contains([MARK.BAR, MARK.LINE, MARK.AREA], specM.getMark())) {
	                return specM.isAggregate();
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitBarTickWithSize',
	        description: 'Do not map field to size channel with bar and tick mark',
	        properties: [property.Property.CHANNEL, property.Property.MARK],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            const mark = specM.getMark();
	            if (util$1.contains([MARK.TICK, MARK.BAR], mark)) {
	                if (specM.channelEncodingField(CHANNEL.SIZE)) {
	                    if (opt.constraintManuallySpecifiedValue) {
	                        // If size is used and we constraintManuallySpecifiedValue,
	                        // then the spec violates this constraint.
	                        return false;
	                    }
	                    else {
	                        // Otherwise have to search for the size channel and check if it is enumerated
	                        const encodings = specM.specQuery.encodings;
	                        for (let i = 0; i < encodings.length; i++) {
	                            const encQ = encodings[i];
	                            if (encQ.channel === CHANNEL.SIZE) {
	                                if (specM.wildcardIndex.hasEncodingProperty(i, property.Property.CHANNEL)) {
	                                    // If enumerated, then this is bad
	                                    return false;
	                                }
	                                else {
	                                    // If it's manually specified, no need to continue searching, just return.
	                                    return true;
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	            return true; // skip
	        }
	    },
	    {
	        name: 'omitBarAreaForLogScale',
	        description: "Do not use bar and area mark for x and y's log scale",
	        properties: [
	            property.Property.MARK,
	            property.Property.CHANNEL,
	            property.Property.SCALE,
	            property.getEncodingNestedProp('scale', 'type'),
	            property.Property.TYPE
	        ],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            const mark = specM.getMark();
	            const encodings = specM.getEncodings();
	            // TODO: mark or scale type should be enumerated
	            if (mark === MARK.AREA || mark === MARK.BAR) {
	                for (let encQ of encodings) {
	                    if (encoding.isFieldQuery(encQ) && ((encQ.channel === CHANNEL.X || encQ.channel === CHANNEL.Y) && encQ.scale)) {
	                        let sType = encoding.scaleType(encQ);
	                        if (sType === scale_1.ScaleType.LOG) {
	                            return false;
	                        }
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitMultipleNonPositionalChannels',
	        description: 'Unless manually specified, do not use multiple non-positional encoding channel to avoid over-encoding.',
	        properties: [property.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            // have to use specM.specQuery.encodings insetad of specM.getEncodings()
	            // since specM.getEncodings() remove encQ with autoCount===false from the array
	            // and thus might shift the index
	            const encodings = specM.specQuery.encodings;
	            let nonPositionChannelCount = 0;
	            let hasEnumeratedNonPositionChannel = false;
	            for (let i = 0; i < encodings.length; i++) {
	                const encQ = encodings[i];
	                if (encoding.isValueQuery(encQ) || encoding.isDisabledAutoCountQuery(encQ)) {
	                    continue; // ignore skipped encoding
	                }
	                const channel = encQ.channel;
	                if (!wildcard.isWildcard(channel)) {
	                    if (NONPOSITION_CHANNELS_INDEX[`${channel}`]) {
	                        nonPositionChannelCount += 1;
	                        if (specM.wildcardIndex.hasEncodingProperty(i, property.Property.CHANNEL)) {
	                            hasEnumeratedNonPositionChannel = true;
	                        }
	                        if (nonPositionChannelCount > 1 &&
	                            (hasEnumeratedNonPositionChannel || opt.constraintManuallySpecifiedValue)) {
	                            return false;
	                        }
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitNonPositionalOrFacetOverPositionalChannels',
	        description: 'Do not use non-positional channels unless all positional channels are used',
	        properties: [property.Property.CHANNEL],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            const encodings = specM.specQuery.encodings;
	            let hasNonPositionalChannelOrFacet = false;
	            let hasEnumeratedNonPositionOrFacetChannel = false;
	            let hasX = false;
	            let hasY = false;
	            for (let i = 0; i < encodings.length; i++) {
	                const encQ = encodings[i];
	                if (encoding.isValueQuery(encQ) || encoding.isDisabledAutoCountQuery(encQ)) {
	                    continue; // ignore skipped encoding
	                }
	                const channel = encQ.channel;
	                if (channel === CHANNEL.X) {
	                    hasX = true;
	                }
	                else if (channel === CHANNEL.Y) {
	                    hasY = true;
	                }
	                else if (!wildcard.isWildcard(channel)) {
	                    // All non positional channel / Facet
	                    hasNonPositionalChannelOrFacet = true;
	                    if (specM.wildcardIndex.hasEncodingProperty(i, property.Property.CHANNEL)) {
	                        hasEnumeratedNonPositionOrFacetChannel = true;
	                    }
	                }
	            }
	            if (hasEnumeratedNonPositionOrFacetChannel ||
	                (opt.constraintManuallySpecifiedValue && hasNonPositionalChannelOrFacet)) {
	                return hasX && hasY;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitRaw',
	        description: 'Omit raw plots.',
	        properties: [property.Property.AGGREGATE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            if (!specM.isAggregate()) {
	                return false;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitRawContinuousFieldForAggregatePlot',
	        description: 'Aggregate plot should not use raw continuous field as group by values. ' +
	            '(Quantitative should be binned. Temporal should have time unit.)',
	        properties: [property.Property.AGGREGATE, property.Property.AUTOCOUNT, property.Property.TIMEUNIT, property.Property.BIN, property.Property.TYPE],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            if (specM.isAggregate()) {
	                const encodings = specM.specQuery.encodings;
	                for (let i = 0; i < encodings.length; i++) {
	                    const encQ = encodings[i];
	                    if (encoding.isValueQuery(encQ) || encoding.isDisabledAutoCountQuery(encQ))
	                        continue; // skip unused encoding
	                    // TODO: aggregate for ordinal and temporal
	                    if (encoding.isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
	                        // Temporal fields should have timeUnit or is still a wildcard
	                        if (!encQ.timeUnit &&
	                            (specM.wildcardIndex.hasEncodingProperty(i, property.Property.TIMEUNIT) || opt.constraintManuallySpecifiedValue)) {
	                            return false;
	                        }
	                    }
	                    if (encQ.type === TYPE.QUANTITATIVE) {
	                        if (encoding.isFieldQuery(encQ) && !encQ.bin && !encQ.aggregate) {
	                            // If Raw Q
	                            if (specM.wildcardIndex.hasEncodingProperty(i, property.Property.BIN) ||
	                                specM.wildcardIndex.hasEncodingProperty(i, property.Property.AGGREGATE) ||
	                                specM.wildcardIndex.hasEncodingProperty(i, property.Property.AUTOCOUNT)) {
	                                // and it's raw from enumeration
	                                return false;
	                            }
	                            if (opt.constraintManuallySpecifiedValue) {
	                                // or if we constraintManuallySpecifiedValue
	                                return false;
	                            }
	                        }
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitRawDetail',
	        description: 'Do not use detail channel with raw plot.',
	        properties: [property.Property.CHANNEL, property.Property.AGGREGATE, property.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, opt) => {
	            if (specM.isAggregate()) {
	                return true;
	            }
	            return util$1.every(specM.specQuery.encodings, (encQ, index) => {
	                if (encoding.isValueQuery(encQ) || encoding.isDisabledAutoCountQuery(encQ))
	                    return true; // ignore autoCount field
	                if (encQ.channel === CHANNEL.DETAIL) {
	                    // Detail channel for raw plot is not good, except when its enumerated
	                    // or when it's manually specified but we constraintManuallySpecifiedValue.
	                    if (specM.wildcardIndex.hasEncodingProperty(index, property.Property.CHANNEL) ||
	                        opt.constraintManuallySpecifiedValue) {
	                        return false;
	                    }
	                }
	                return true;
	            });
	        }
	    },
	    {
	        name: 'omitRepeatedField',
	        description: 'Each field should be mapped to only one channel',
	        properties: [property.Property.FIELD],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            let fieldUsed = {};
	            let fieldEnumerated = {};
	            const encodings = specM.specQuery.encodings;
	            for (let i = 0; i < encodings.length; i++) {
	                const encQ = encodings[i];
	                if (encoding.isValueQuery(encQ) || encoding.isAutoCountQuery(encQ))
	                    continue;
	                let field;
	                if (encQ.field && !wildcard.isWildcard(encQ.field)) {
	                    field = encQ.field;
	                }
	                if (encoding.isAutoCountQuery(encQ) && !wildcard.isWildcard(encQ.autoCount)) {
	                    field = 'count_*';
	                }
	                if (field) {
	                    if (specM.wildcardIndex.hasEncodingProperty(i, property.Property.FIELD)) {
	                        fieldEnumerated[field] = true;
	                    }
	                    // When the field is specified previously,
	                    // if it is enumerated (either previously or in this encQ)
	                    // or if the opt.constraintManuallySpecifiedValue is true,
	                    // then it violates the constraint.
	                    if (fieldUsed[field]) {
	                        if (fieldEnumerated[field] || opt.constraintManuallySpecifiedValue) {
	                            return false;
	                        }
	                    }
	                    fieldUsed[field] = true;
	                }
	            }
	            return true;
	        }
	    },
	    // TODO: omitShapeWithBin
	    {
	        name: 'omitVerticalDotPlot',
	        description: 'Do not output vertical dot plot.',
	        properties: [property.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            const encodings = specM.getEncodings();
	            if (encodings.length === 1 && encodings[0].channel === CHANNEL.Y) {
	                return false;
	            }
	            return true;
	        }
	    },
	    // EXPENSIVE CONSTRAINTS -- check them later!
	    {
	        name: 'hasAppropriateGraphicTypeForMark',
	        description: 'Has appropriate graphic type for mark',
	        properties: [
	            property.Property.CHANNEL,
	            property.Property.MARK,
	            property.Property.TYPE,
	            property.Property.TIMEUNIT,
	            property.Property.BIN,
	            property.Property.AGGREGATE,
	            property.Property.AUTOCOUNT
	        ],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, __) => {
	            const mark = specM.getMark();
	            switch (mark) {
	                case MARK.AREA:
	                case MARK.LINE:
	                    if (specM.isAggregate()) {
	                        // TODO: refactor based on profiling statistics
	                        const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
	                        const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
	                        const xIsMeasure = encoding.isMeasure(xEncQ);
	                        const yIsMeasure = encoding.isMeasure(yEncQ);
	                        // for aggregate line / area, we need at least one group-by axis and one measure axis.
	                        return (xEncQ &&
	                            yEncQ &&
	                            xIsMeasure !== yIsMeasure &&
	                            // and the dimension axis should not be nominal
	                            // TODO: make this clause optional
	                            !(encoding.isFieldQuery(xEncQ) && !xIsMeasure && util$1.contains(['nominal', 'key'], xEncQ.type)) &&
	                            !(encoding.isFieldQuery(yEncQ) && !yIsMeasure && util$1.contains(['nominal', 'key'], yEncQ.type)));
	                        // TODO: allow connected scatterplot
	                    }
	                    return true;
	                case MARK.TEXT:
	                    // FIXME correctly when we add text
	                    return true;
	                case MARK.BAR:
	                case MARK.TICK:
	                    // Bar and tick should not use size.
	                    if (specM.channelEncodingField(CHANNEL.SIZE)) {
	                        return false;
	                    }
	                    else {
	                        // Tick and Bar should have one and only one measure
	                        const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
	                        const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
	                        const xIsMeasure = encoding.isMeasure(xEncQ);
	                        const yIsMeasure = encoding.isMeasure(yEncQ);
	                        if (xIsMeasure !== yIsMeasure) {
	                            return true;
	                        }
	                        return false;
	                    }
	                case MARK.RECT:
	                    // Until CompassQL supports layering, it only makes sense for
	                    // rect to encode DxD or 1xD (otherwise just use bar).
	                    // Furthermore, color should only be used in a 'heatmap' fashion
	                    // (with a measure field).
	                    const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
	                    const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
	                    const xIsDimension = encoding.isDimension(xEncQ);
	                    const yIsDimension = encoding.isDimension(yEncQ);
	                    const colorEncQ = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
	                    const colorIsQuantitative = encoding.isMeasure(colorEncQ);
	                    const colorIsOrdinal = encoding.isFieldQuery(colorEncQ) ? colorEncQ.type === TYPE.ORDINAL : false;
	                    const correctChannels = (xIsDimension && yIsDimension) ||
	                        (xIsDimension && !specM.channelUsed(CHANNEL.Y)) ||
	                        (yIsDimension && !specM.channelUsed(CHANNEL.X));
	                    const correctColor = !colorEncQ || (colorEncQ && (colorIsQuantitative || colorIsOrdinal));
	                    return correctChannels && correctColor;
	                case MARK.CIRCLE:
	                case MARK.POINT:
	                case MARK.SQUARE:
	                case MARK.RULE:
	                    return true;
	            }
	            /* istanbul ignore next */
	            throw new Error(`hasAllRequiredChannelsForMark not implemented for mark${mark}`);
	        }
	    },
	    {
	        name: 'omitInvalidStackSpec',
	        description: 'If stack is specified, must follow Vega-Lite stack rules',
	        properties: [
	            property.Property.STACK,
	            property.Property.FIELD,
	            property.Property.CHANNEL,
	            property.Property.MARK,
	            property.Property.AGGREGATE,
	            property.Property.AUTOCOUNT,
	            property.Property.SCALE,
	            property.getEncodingNestedProp('scale', 'type'),
	            property.Property.TYPE
	        ],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            if (!specM.wildcardIndex.hasProperty(property.Property.STACK)) {
	                return true;
	            }
	            const stackProps = specM.getVlStack();
	            if (stackProps === null && specM.getStackOffset() !== null) {
	                return false;
	            }
	            if (stackProps.fieldChannel !== specM.getStackChannel()) {
	                return false;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitNonSumStack',
	        description: 'Stack specifications that use non-summative aggregates should be omitted (even implicit ones)',
	        properties: [
	            property.Property.CHANNEL,
	            property.Property.MARK,
	            property.Property.AGGREGATE,
	            property.Property.AUTOCOUNT,
	            property.Property.SCALE,
	            property.getEncodingNestedProp('scale', 'type'),
	            property.Property.TYPE
	        ],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: (specM, _, __) => {
	            const specStack = specM.getVlStack();
	            if (specStack != null) {
	                const stackParentEncQ = specM.getEncodingQueryByChannel(specStack.fieldChannel);
	                if (!util$1.contains(aggregate_1.SUM_OPS, stackParentEncQ.aggregate)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitTableWithOcclusionIfAutoAddCount',
	        description: 'Plots without aggregation or autocount where x and y are both discrete should be omitted if autoAddCount is enabled as they often lead to occlusion',
	        properties: [
	            property.Property.CHANNEL,
	            property.Property.TYPE,
	            property.Property.TIMEUNIT,
	            property.Property.BIN,
	            property.Property.AGGREGATE,
	            property.Property.AUTOCOUNT
	        ],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: (specM, _, opt) => {
	            if (opt.autoAddCount) {
	                const xEncQ = specM.getEncodingQueryByChannel('x');
	                const yEncQ = specM.getEncodingQueryByChannel('y');
	                if ((!encoding.isFieldQuery(xEncQ) || encoding.isDimension(xEncQ)) && (!encoding.isFieldQuery(yEncQ) || encoding.isDimension(yEncQ))) {
	                    if (!specM.isAggregate()) {
	                        return false;
	                    }
	                    else {
	                        return util$1.every(specM.getEncodings(), encQ => {
	                            let channel = encQ.channel;
	                            if (channel !== CHANNEL.X &&
	                                channel !== CHANNEL.Y &&
	                                channel !== CHANNEL.ROW &&
	                                channel !== CHANNEL.COLUMN) {
	                                // Non-position fields should not be unaggreated fields
	                                if (encoding.isFieldQuery(encQ) && !encQ.aggregate) {
	                                    return false;
	                                }
	                            }
	                            return true;
	                        });
	                    }
	                }
	            }
	            return true;
	        }
	    }
	].map(sc => new SpecConstraintModel(sc));
	// For testing
	exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS.reduce((m, c) => {
	    m[c.name()] = c;
	    return m;
	}, {});
	const SPEC_CONSTRAINTS_BY_PROPERTY = exports.SPEC_CONSTRAINTS.reduce((index, c) => {
	    for (const prop of c.properties()) {
	        // Initialize array and use it
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex.PropIndex());
	/**
	 * Check all encoding constraints for a particular property and index tuple
	 */
	function checkSpec(prop, wildcard, specM, schema, opt) {
	    // Check encoding constraint
	    const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    for (const c of specConstraints) {
	        // Check if the constraint is enabled
	        if (c.strict() || !!opt[c.name()]) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            const satisfy = c.satisfy(specM, schema, opt);
	            if (!satisfy) {
	                let violatedConstraint = `(spec) ${c.name()}`;
	                /* istanbul ignore if */
	                if (opt.verbose) {
	                    console.log(`${violatedConstraint} failed with ${specM.toShorthand()} for ${wildcard.name}`);
	                }
	                return violatedConstraint;
	            }
	        }
	    }
	    return null;
	}
	exports.checkSpec = checkSpec;

	});

	var constraint = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.spec = exports.encoding = void 0;
	const encoding = __importStar(encoding$1);
	exports.encoding = encoding;
	const spec = __importStar(spec$1);
	exports.spec = spec;

	});

	var enumerator = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EncodingPropertyGeneratorFactory = exports.getEnumerator = void 0;





	const ENUMERATOR_INDEX = new propindex.PropIndex();
	function getEnumerator(prop) {
	    return ENUMERATOR_INDEX.get(prop);
	}
	exports.getEnumerator = getEnumerator;
	ENUMERATOR_INDEX.set('mark', (wildcardIndex, schema, opt) => {
	    return (answerSet, specM) => {
	        const markWildcard = specM.getMark();
	        // enumerate the value
	        markWildcard.enum.forEach((mark) => {
	            specM.setMark(mark);
	            // Check spec constraint
	            const violatedSpecConstraint = spec$1.checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
	            if (!violatedSpecConstraint) {
	                // emit
	                answerSet.push(specM.duplicate());
	            }
	        });
	        // Reset to avoid side effect
	        specM.resetMark();
	        return answerSet;
	    };
	});
	property.ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
	    ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
	});
	property.ENCODING_NESTED_PROPS.forEach((nestedProp) => {
	    ENUMERATOR_INDEX.set(nestedProp, EncodingPropertyGeneratorFactory(nestedProp));
	});
	/**
	 * @param prop property type.
	 * @return an answer set reducer factory for the given prop.
	 */
	function EncodingPropertyGeneratorFactory(prop) {
	    /**
	     * @return as reducer that takes a specQueryModel as input and output an answer set array.
	     */
	    return (wildcardIndex, schema, opt) => {
	        return (answerSet, specM) => {
	            // index of encoding mappings that require enumeration
	            const indices = wildcardIndex.encodingIndicesByProperty.get(prop);
	            function enumerate(jobIndex) {
	                if (jobIndex === indices.length) {
	                    // emit and terminate
	                    answerSet.push(specM.duplicate());
	                    return;
	                }
	                const index = indices[jobIndex];
	                const wildcard = wildcardIndex.encodings[index].get(prop);
	                const encQ = specM.getEncodingQueryByIndex(index);
	                const propWildcard = specM.getEncodingProperty(index, prop);
	                if (encoding.isValueQuery(encQ) || (
	                // TODO: encQ.exclude
	                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
	                // for this encoding query because they will be excluded anyway.
	                // Thus, we can just move on to the next encoding to enumerate.
	                (encoding.isDisabledAutoCountQuery(encQ)) ||
	                    // nested encoding property might have its parent set to false
	                    // therefore, we no longer have to enumerate them
	                    !propWildcard)) { // TODO: encQ.excluded
	                    enumerate(jobIndex + 1);
	                }
	                else {
	                    wildcard.enum.forEach((propVal) => {
	                        if (propVal === null) {
	                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
	                            // convert undefined in an array into null
	                            propVal = undefined;
	                        }
	                        specM.setEncodingProperty(index, prop, propVal, wildcard);
	                        // Check encoding constraint
	                        const violatedEncodingConstraint = encoding$1.checkEncoding(prop, wildcard, index, specM, schema, opt);
	                        if (violatedEncodingConstraint) {
	                            return; // do not keep searching
	                        }
	                        // Check spec constraint
	                        const violatedSpecConstraint = spec$1.checkSpec(prop, wildcard, specM, schema, opt);
	                        if (violatedSpecConstraint) {
	                            return; // do not keep searching
	                        }
	                        // If qualify all of the constraints, keep enumerating
	                        enumerate(jobIndex + 1);
	                    });
	                    // Reset to avoid side effect
	                    specM.resetEncodingProperty(index, prop, wildcard);
	                }
	            }
	            // start enumerating from 0
	            enumerate(0);
	            return answerSet;
	        };
	    };
	}
	exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;

	});

	var groupby = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM = exports.toString = exports.parseGroupBy = exports.isExtendedGroupBy = exports.REPLACE_MARK_STYLE_CHANNELS = exports.REPLACE_FACET_CHANNELS = exports.REPLACE_XY_CHANNELS = exports.REPLACE_BLANK_FIELDS = void 0;





	exports.REPLACE_BLANK_FIELDS = { '*': '' };
	exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
	exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
	exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
	function isExtendedGroupBy(g) {
	    return util.isObject(g) && !!g['property'];
	}
	exports.isExtendedGroupBy = isExtendedGroupBy;
	function parseGroupBy(groupBy, include, replaceIndex) {
	    include = include || new propindex.PropIndex();
	    replaceIndex = replaceIndex || new propindex.PropIndex();
	    groupBy.forEach((grpBy) => {
	        if (isExtendedGroupBy(grpBy)) {
	            include.setByKey(grpBy.property, true);
	            replaceIndex.setByKey(grpBy.property, grpBy.replace);
	        }
	        else {
	            include.setByKey(grpBy, true);
	        }
	    });
	    return {
	        include: include,
	        replaceIndex: replaceIndex,
	        replacer: shorthand.getReplacerIndex(replaceIndex)
	    };
	}
	exports.parseGroupBy = parseGroupBy;
	function toString(groupBy) {
	    if (util.isArray(groupBy)) {
	        return groupBy.map((g) => {
	            if (isExtendedGroupBy(g)) {
	                if (g.replace) {
	                    let replaceIndex = util$1.keys(g.replace).reduce((index, valFrom) => {
	                        const valTo = g.replace[valFrom];
	                        (index[valTo] = index[valTo] || []).push(valFrom);
	                        return index;
	                    }, {});
	                    return `${g.property}[` + util$1.keys(replaceIndex).map((valTo) => {
	                        const valsFrom = replaceIndex[valTo].sort();
	                        return `${valsFrom.join(',')}=>${valTo}`;
	                    }).join(';') + ']';
	                }
	                return g.property;
	            }
	            return g;
	        }).join(',');
	    }
	    else {
	        return groupBy;
	    }
	}
	exports.toString = toString;
	exports.GROUP_BY_FIELD_TRANSFORM = [
	    property.Property.FIELD, property.Property.TYPE,
	    property.Property.AGGREGATE, property.Property.BIN, property.Property.TIMEUNIT, property.Property.STACK
	];
	exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM.concat([
	    {
	        property: property.Property.CHANNEL,
	        replace: {
	            'x': 'xy', 'y': 'xy',
	            'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
	            'row': 'facet', 'column': 'facet'
	        }
	    }
	]);

	});

	var nest_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PARSED_GROUP_BY_ENCODING = exports.PARSED_GROUP_BY_FIELD_TRANSFORM = exports.getGroupByKey = exports.nest = exports.SPEC = exports.ENCODING = exports.FIELD_TRANSFORM = exports.FIELD = exports.registerKeyFn = void 0;





	/**
	 * Registry for all possible grouping key functions.
	 */
	let groupRegistry = {};
	/**
	 * Add a grouping function to the registry.
	 */
	function registerKeyFn(name, keyFn) {
	    groupRegistry[name] = keyFn;
	}
	exports.registerKeyFn = registerKeyFn;
	exports.FIELD = 'field';
	exports.FIELD_TRANSFORM = 'fieldTransform';
	exports.ENCODING = 'encoding';
	exports.SPEC = 'spec';
	/**
	 * Group the input spec query model by a key function registered in the group registry
	 * @return
	 */
	function nest(specModels, queryNest) {
	    if (queryNest) {
	        const rootGroup = {
	            name: '',
	            path: '',
	            items: []
	        };
	        let groupIndex = {};
	        // global `includes` and `replaces` will get augmented by each level's groupBy.
	        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
	        // `replace` can be overriden in a lower-level to support different grouping.
	        let includes = [];
	        let replaces = [];
	        let replacers = [];
	        for (let l = 0; l < queryNest.length; l++) {
	            includes.push(l > 0 ? includes[l - 1].duplicate() : new propindex.PropIndex());
	            replaces.push(l > 0 ? replaces[l - 1].duplicate() : new propindex.PropIndex());
	            const groupBy = queryNest[l].groupBy;
	            if (util.isArray(groupBy)) {
	                // If group is array, it's an array of extended group by that need to be parsed
	                let parsedGroupBy = groupby.parseGroupBy(groupBy, includes[l], replaces[l]);
	                replacers.push(parsedGroupBy.replacer);
	            }
	        }
	        // With includes and replacers, now we can construct the nesting tree
	        specModels.forEach(specM => {
	            let path = '';
	            let group = rootGroup;
	            for (let l = 0; l < queryNest.length; l++) {
	                const groupBy = (group.groupBy = queryNest[l].groupBy);
	                group.orderGroupBy = queryNest[l].orderGroupBy;
	                const key = util.isArray(groupBy)
	                    ? shorthand.spec(specM.specQuery, includes[l], replacers[l])
	                    : groupRegistry[groupBy](specM.specQuery);
	                path += `/${key}`;
	                if (!groupIndex[path]) {
	                    // this item already exists on the path
	                    groupIndex[path] = {
	                        name: key,
	                        path: path,
	                        items: []
	                    };
	                    group.items.push(groupIndex[path]);
	                }
	                group = groupIndex[path];
	            }
	            group.items.push(specM);
	        });
	        return rootGroup;
	    }
	    else {
	        // no nesting, just return a flat group
	        return {
	            name: '',
	            path: '',
	            items: specModels
	        };
	    }
	}
	exports.nest = nest;
	// TODO: move this to groupBy, rename properly, and export
	const GROUP_BY_FIELD = [property.Property.FIELD];
	const PARSED_GROUP_BY_FIELD = groupby.parseGroupBy(GROUP_BY_FIELD);
	function getGroupByKey(specM, groupBy) {
	    return groupRegistry[groupBy](specM);
	}
	exports.getGroupByKey = getGroupByKey;
	registerKeyFn(exports.FIELD, (specQ) => {
	    return shorthand.spec(specQ, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
	});
	exports.PARSED_GROUP_BY_FIELD_TRANSFORM = groupby.parseGroupBy(groupby.GROUP_BY_FIELD_TRANSFORM);
	registerKeyFn(exports.FIELD_TRANSFORM, (specQ) => {
	    return shorthand.spec(specQ, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.include, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
	});
	exports.PARSED_GROUP_BY_ENCODING = groupby.parseGroupBy(groupby.GROUP_BY_ENCODING);
	registerKeyFn(exports.ENCODING, (specQ) => {
	    return shorthand.spec(specQ, exports.PARSED_GROUP_BY_ENCODING.include, exports.PARSED_GROUP_BY_ENCODING.replacer);
	});
	registerKeyFn(exports.SPEC, (specQ) => JSON.stringify(specQ));

	});

	var wildcardindex = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WildcardIndex = void 0;


	class WildcardIndex {
	    constructor() {
	        this._mark = undefined;
	        this._encodings = {};
	        this._encodingIndicesByProperty = new propindex.PropIndex();
	    }
	    setEncodingProperty(index, prop, wildcard) {
	        const encodingsIndex = this._encodings;
	        // Init encoding index and set prop
	        const encIndex = encodingsIndex[index] = encodingsIndex[index] || new propindex.PropIndex();
	        encIndex.set(prop, wildcard);
	        // Initialize indicesByProperty[prop] and add index
	        const indicesByProp = this._encodingIndicesByProperty;
	        indicesByProp.set(prop, (indicesByProp.get(prop) || []));
	        indicesByProp.get(prop).push(index);
	        return this;
	    }
	    hasEncodingProperty(index, prop) {
	        return !!this._encodings[index] && this._encodings[index].has(prop);
	    }
	    hasProperty(prop) {
	        if (property.isEncodingProperty(prop)) {
	            return this.encodingIndicesByProperty.has(prop);
	        }
	        else if (prop === 'mark') {
	            return !!this.mark;
	        }
	        /* istanbul ignore next */
	        throw new Error(`Unimplemented for property ${prop}`);
	    }
	    isEmpty() {
	        return !this.mark && this.encodingIndicesByProperty.size() === 0;
	    }
	    setMark(mark) {
	        this._mark = mark;
	        return this;
	    }
	    get mark() {
	        return this._mark;
	    }
	    get encodings() {
	        return this._encodings;
	    }
	    get encodingIndicesByProperty() {
	        return this._encodingIndicesByProperty;
	    }
	}
	exports.WildcardIndex = WildcardIndex;

	});

	var model = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SpecQueryModel = void 0;

	const TYPE = __importStar(require$$1$1);









	/**
	 * Internal class for specQuery that provides helper for the enumeration process.
	 */
	class SpecQueryModel {
	    constructor(spec, wildcardIndex, schema, opt, wildcardAssignment) {
	        this._rankingScore = {};
	        this._spec = spec;
	        this._channelFieldCount = spec.encodings.reduce((m, encQ) => {
	            if (!wildcard.isWildcard(encQ.channel) && (!encoding.isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
	                m[`${encQ.channel}`] = 1;
	            }
	            return m;
	        }, {});
	        this._wildcardIndex = wildcardIndex;
	        this._assignedWildcardIndex = wildcardAssignment;
	        this._opt = opt;
	        this._schema = schema;
	    }
	    /**
	     * Build a WildcardIndex by detecting wildcards
	     * in the input specQuery and replacing short wildcards ("?")
	     * with full ones (objects with `name` and `enum` values).
	     *
	     * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
	     */
	    static build(specQ, schema, opt) {
	        let wildcardIndex = new wildcardindex.WildcardIndex();
	        // mark
	        if (wildcard.isWildcard(specQ.mark)) {
	            const name = wildcard.getDefaultName(property.Property.MARK);
	            specQ.mark = wildcard.initWildcard(specQ.mark, name, opt.enum.mark);
	            wildcardIndex.setMark(specQ.mark);
	        }
	        // TODO: transform
	        // encodings
	        specQ.encodings.forEach((encQ, index) => {
	            if (encoding.isAutoCountQuery(encQ)) {
	                // This is only for testing purpose
	                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
	                encQ.type = TYPE.QUANTITATIVE; // autoCount is always quantitative
	            }
	            if (encoding.isFieldQuery(encQ) && encQ.type === undefined) {
	                // type is optional -- we automatically augment wildcard if not specified
	                encQ.type = wildcard.SHORT_WILDCARD;
	            }
	            // For each property of the encodingQuery, enumerate
	            property.ENCODING_TOPLEVEL_PROPS.forEach(prop => {
	                if (wildcard.isWildcard(encQ[prop])) {
	                    // Assign default wildcard name and enum values.
	                    const defaultWildcardName = wildcard.getDefaultName(prop) + index;
	                    const defaultEnumValues = wildcard.getDefaultEnumValues(prop, schema, opt);
	                    const wildcard$1 = (encQ[prop] = wildcard.initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues));
	                    // Add index of the encoding mapping to the property's wildcard index.
	                    wildcardIndex.setEncodingProperty(index, prop, wildcard$1);
	                }
	            });
	            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
	            property.ENCODING_NESTED_PROPS.forEach(prop => {
	                const propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
	                if (propObj) {
	                    const child = prop.child;
	                    if (wildcard.isWildcard(propObj[child])) {
	                        // Assign default wildcard name and enum values.
	                        const defaultWildcardName = wildcard.getDefaultName(prop) + index;
	                        const defaultEnumValues = wildcard.getDefaultEnumValues(prop, schema, opt);
	                        const wildcard$1 = (propObj[child] = wildcard.initWildcard(propObj[child], defaultWildcardName, defaultEnumValues));
	                        // Add index of the encoding mapping to the property's wildcard index.
	                        wildcardIndex.setEncodingProperty(index, prop, wildcard$1);
	                    }
	                }
	            });
	        });
	        // AUTO COUNT
	        // Add Auto Count Field
	        if (opt.autoAddCount) {
	            const channel = {
	                name: wildcard.getDefaultName(property.Property.CHANNEL) + specQ.encodings.length,
	                enum: wildcard.getDefaultEnumValues(property.Property.CHANNEL, schema, opt)
	            };
	            const autoCount = {
	                name: wildcard.getDefaultName(property.Property.AUTOCOUNT) + specQ.encodings.length,
	                enum: [false, true]
	            };
	            const countEncQ = {
	                channel,
	                autoCount,
	                type: TYPE.QUANTITATIVE
	            };
	            specQ.encodings.push(countEncQ);
	            const index = specQ.encodings.length - 1;
	            // Add index of the encoding mapping to the property's wildcard index.
	            wildcardIndex.setEncodingProperty(index, property.Property.CHANNEL, channel);
	            wildcardIndex.setEncodingProperty(index, property.Property.AUTOCOUNT, autoCount);
	        }
	        return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
	    }
	    get wildcardIndex() {
	        return this._wildcardIndex;
	    }
	    get schema() {
	        return this._schema;
	    }
	    get specQuery() {
	        return this._spec;
	    }
	    duplicate() {
	        return new SpecQueryModel(util$1.duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, util$1.duplicate(this._assignedWildcardIndex));
	    }
	    setMark(mark) {
	        const name = this._wildcardIndex.mark.name;
	        this._assignedWildcardIndex[name] = this._spec.mark = mark;
	    }
	    resetMark() {
	        const wildcard = (this._spec.mark = this._wildcardIndex.mark);
	        delete this._assignedWildcardIndex[wildcard.name];
	    }
	    getMark() {
	        return this._spec.mark;
	    }
	    getEncodingProperty(index, prop) {
	        const encQ = this._spec.encodings[index];
	        if (property.isEncodingNestedProp(prop)) {
	            // nested encoding property
	            return encQ[prop.parent][prop.child];
	        }
	        return encQ[prop]; // encoding property (non-nested)
	    }
	    setEncodingProperty(index, prop, value, wildcard$1) {
	        const encQ = this._spec.encodings[index];
	        if (prop === property.Property.CHANNEL && encQ.channel && !wildcard.isWildcard(encQ.channel)) {
	            // If there is an old channel
	            this._channelFieldCount[encQ.channel]--;
	        }
	        if (property.isEncodingNestedProp(prop)) {
	            // nested encoding property
	            encQ[prop.parent][prop.child] = value;
	        }
	        else if (property.isEncodingNestedParent(prop) && value === true) {
	            encQ[prop] = util$1.extend({}, encQ[prop], // copy all existing properties
	            { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
	            );
	        }
	        else {
	            // encoding property (non-nested)
	            encQ[prop] = value;
	        }
	        this._assignedWildcardIndex[wildcard$1.name] = value;
	        if (prop === property.Property.CHANNEL) {
	            // If there is a new channel, make sure it exists and add it to the count.
	            this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
	        }
	    }
	    resetEncodingProperty(index, prop, wildcard) {
	        const encQ = this._spec.encodings[index];
	        if (prop === property.Property.CHANNEL) {
	            this._channelFieldCount[encQ.channel]--;
	        }
	        // reset it to wildcard
	        if (property.isEncodingNestedProp(prop)) {
	            // nested encoding property
	            encQ[prop.parent][prop.child] = wildcard;
	        }
	        else {
	            // encoding property (non-nested)
	            encQ[prop] = wildcard;
	        }
	        // add remove value that is reset from the assignment map
	        delete this._assignedWildcardIndex[wildcard.name];
	    }
	    channelUsed(channel) {
	        // do not include encoding that has autoCount = false because it is not a part of the output spec.
	        return this._channelFieldCount[channel] > 0;
	    }
	    channelEncodingField(channel) {
	        const encodingQuery = this.getEncodingQueryByChannel(channel);
	        return encoding.isFieldQuery(encodingQuery);
	    }
	    getEncodings() {
	        // do not include encoding that has autoCount = false because it is not a part of the output spec.
	        return this._spec.encodings.filter(encQ => !encoding.isDisabledAutoCountQuery(encQ));
	    }
	    getEncodingQueryByChannel(channel) {
	        for (let specEncoding of this._spec.encodings) {
	            if (specEncoding.channel === channel) {
	                return specEncoding;
	            }
	        }
	        return undefined;
	    }
	    getEncodingQueryByIndex(i) {
	        return this._spec.encodings[i];
	    }
	    isAggregate() {
	        return spec.isAggregate(this._spec);
	    }
	    /**
	     * @return The Vega-Lite `StackProperties` object that describes the stack
	     * configuration of `this`. Returns `null` if this is not stackable.
	     */
	    getVlStack() {
	        return spec.getVlStack(this._spec);
	    }
	    /**
	     * @return The `StackOffset` specified in `this`, `undefined` if none
	     * is specified.
	     */
	    getStackOffset() {
	        return spec.getStackOffset(this._spec);
	    }
	    /**
	     * @return The `ExtendedChannel` in which `stack` is specified in `this`, or
	     * `null` if none is specified.
	     */
	    getStackChannel() {
	        return spec.getStackChannel(this._spec);
	    }
	    toShorthand(groupBy) {
	        if (groupBy) {
	            if (util.isString(groupBy)) {
	                return nest_1.getGroupByKey(this.specQuery, groupBy);
	            }
	            const parsedGroupBy = groupby.parseGroupBy(groupBy);
	            return shorthand.spec(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
	        }
	        return shorthand.spec(this._spec);
	    }
	    /**
	     * Convert a query to a Vega-Lite spec if it is completed.
	     * @return a Vega-Lite spec if completed, null otherwise.
	     */
	    toSpec(data) {
	        if (wildcard.isWildcard(this._spec.mark))
	            return null;
	        let spec = {};
	        data = data || this._spec.data;
	        if (data) {
	            spec.data = data;
	        }
	        if (this._spec.transform) {
	            spec.transform = this._spec.transform;
	        }
	        spec.mark = this._spec.mark;
	        spec.encoding = encoding.toEncoding(this.specQuery.encodings, { schema: this._schema, wildcardMode: 'null' });
	        if (this._spec.width) {
	            spec.width = this._spec.width;
	        }
	        if (this._spec.height) {
	            spec.height = this._spec.height;
	        }
	        if (this._spec.background) {
	            spec.background = this._spec.background;
	        }
	        if (this._spec.padding) {
	            spec.padding = this._spec.padding;
	        }
	        if (this._spec.title) {
	            spec.title = this._spec.title;
	        }
	        if (spec.encoding === null) {
	            return null;
	        }
	        if (this._spec.config || this._opt.defaultSpecConfig)
	            spec.config = util$1.extend({}, this._opt.defaultSpecConfig, this._spec.config);
	        return spec;
	    }
	    getRankingScore(rankingName) {
	        return this._rankingScore[rankingName];
	    }
	    setRankingScore(rankingName, score) {
	        this._rankingScore[rankingName] = score;
	    }
	}
	exports.SpecQueryModel = SpecQueryModel;

	});

	var transform = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	});

	var normalize_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.normalize = void 0;

	/**
	 * Normalize the non-nested version of the query
	 * (basically when you have a `groupBy`)
	 * to a standardize nested.
	 */
	function normalize(q) {
	    if (q.groupBy) {
	        let nest = {
	            groupBy: q.groupBy
	        };
	        if (q.orderBy) {
	            nest.orderGroupBy = q.orderBy;
	        }
	        let normalizedQ = {
	            spec: util$1.duplicate(q.spec),
	            nest: [nest],
	        };
	        if (q.chooseBy) {
	            normalizedQ.chooseBy = q.chooseBy;
	        }
	        if (q.config) {
	            normalizedQ.config = q.config;
	        }
	        return normalizedQ;
	    }
	    return util$1.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
	}
	exports.normalize = normalize;

	});

	var query = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.transform = exports.spec = exports.shorthand = exports.groupBy = exports.encoding = exports.normalize = void 0;
	const encoding$1 = __importStar(encoding);
	exports.encoding = encoding$1;
	const groupBy = __importStar(groupby);
	exports.groupBy = groupBy;
	const shorthand$1 = __importStar(shorthand);
	exports.shorthand = shorthand$1;
	const spec$1 = __importStar(spec);
	exports.spec = spec$1;
	const transform$1 = __importStar(transform);
	exports.transform = transform$1;

	Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_1.normalize; } });

	});

	var result = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mapLeaves = exports.getTopResultTreeItem = exports.isResultTree = void 0;
	function isResultTree(item) {
	    return item.items !== undefined;
	}
	exports.isResultTree = isResultTree;
	function getTopResultTreeItem(specQuery) {
	    let topItem = specQuery.items[0];
	    while (topItem && isResultTree(topItem)) {
	        topItem = topItem.items[0];
	    }
	    return topItem;
	}
	exports.getTopResultTreeItem = getTopResultTreeItem;
	function mapLeaves(group, f) {
	    return Object.assign(Object.assign({}, group), { items: group.items.map(item => (isResultTree(item) ? mapLeaves(item, f) : f(item))) });
	}
	exports.mapLeaves = mapLeaves;

	});

	var base$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Scorer = void 0;
	class Scorer {
	    constructor(type) {
	        this.type = type;
	        this.scoreIndex = this.initScore();
	    }
	    getFeatureScore(feature) {
	        const type = this.type;
	        const score = this.scoreIndex[feature];
	        if (score !== undefined) {
	            return { type, feature, score };
	        }
	        return undefined;
	    }
	}
	exports.Scorer = Scorer;

	});

	var type$3 = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getExtendedType = exports.NONE = exports.K = exports.N = exports.O = exports.TIMEUNIT_O = exports.TIMEUNIT_T = exports.T = exports.BIN_Q = exports.Q = exports.ExtendedType = void 0;

	const TYPE = __importStar(require$$1$1);


	/**
	 * Finer grained data types that takes binning and timeUnit into account.
	 */
	var ExtendedType;
	(function (ExtendedType) {
	    ExtendedType[ExtendedType["Q"] = TYPE.QUANTITATIVE] = "Q";
	    ExtendedType[ExtendedType["BIN_Q"] = (`bin_${TYPE.QUANTITATIVE}`)] = "BIN_Q";
	    ExtendedType[ExtendedType["T"] = TYPE.TEMPORAL] = "T";
	    /**
	     * Time Unit Temporal Field with time scale.
	     */
	    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
	    /**
	     * Time Unit Temporal Field with ordinal scale.
	     */
	    ExtendedType[ExtendedType["TIMEUNIT_O"] = (`timeUnit_${TYPE.ORDINAL}`)] = "TIMEUNIT_O";
	    ExtendedType[ExtendedType["O"] = TYPE.ORDINAL] = "O";
	    ExtendedType[ExtendedType["N"] = TYPE.NOMINAL] = "N";
	    ExtendedType[ExtendedType["K"] = expandedtype.ExpandedType.KEY] = "K";
	    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
	})(ExtendedType = exports.ExtendedType || (exports.ExtendedType = {}));
	exports.Q = ExtendedType.Q;
	exports.BIN_Q = ExtendedType.BIN_Q;
	exports.T = ExtendedType.T;
	exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
	exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
	exports.O = ExtendedType.O;
	exports.N = ExtendedType.N;
	exports.K = ExtendedType.K;
	exports.NONE = ExtendedType.NONE;
	function getExtendedType(fieldQ) {
	    if (fieldQ.bin) {
	        return ExtendedType.BIN_Q;
	    }
	    else if (fieldQ.timeUnit) {
	        const sType = encoding.scaleType(fieldQ);
	        return scale_1.hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
	    }
	    return fieldQ.type;
	}
	exports.getExtendedType = getExtendedType;

	});

	var axis$1 = createCommonjsModule(function (module, exports) {
	/**
	 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
	 */
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AxisScorer = void 0;
	const CHANNEL = __importStar(require$$0);




	/**
	 * Effectiveness Score for preferred axis.
	 */
	class AxisScorer extends base$1.Scorer {
	    constructor() {
	        super('Axis');
	    }
	    initScore(opt = {}) {
	        opt = Object.assign(Object.assign({}, config.DEFAULT_QUERY_CONFIG), opt);
	        let score = {};
	        const preferredAxes = [
	            {
	                feature: type$3.BIN_Q,
	                opt: 'preferredBinAxis'
	            },
	            {
	                feature: type$3.T,
	                opt: 'preferredTemporalAxis'
	            },
	            {
	                feature: type$3.TIMEUNIT_T,
	                opt: 'preferredTemporalAxis'
	            },
	            {
	                feature: type$3.TIMEUNIT_O,
	                opt: 'preferredTemporalAxis'
	            },
	            {
	                feature: type$3.O,
	                opt: 'preferredOrdinalAxis'
	            },
	            {
	                feature: type$3.N,
	                opt: 'preferredNominalAxis'
	            }
	        ];
	        preferredAxes.forEach(pAxis => {
	            if (opt[pAxis.opt] === CHANNEL.X) {
	                // penalize the other axis
	                score[`${pAxis.feature}_${CHANNEL.Y}`] = -0.01;
	            }
	            else if (opt[pAxis.opt] === CHANNEL.Y) {
	                // penalize the other axis
	                score[`${pAxis.feature}_${CHANNEL.X}`] = -0.01;
	            }
	        });
	        return score;
	    }
	    featurize(type, channel) {
	        return `${type}_${channel}`;
	    }
	    getScore(specM, _, __) {
	        return specM.getEncodings().reduce((features, encQ) => {
	            if (encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) {
	                const type = type$3.getExtendedType(encQ);
	                const feature = this.featurize(type, encQ.channel);
	                const featureScore = this.getFeatureScore(feature);
	                if (featureScore) {
	                    features.push(featureScore);
	                }
	            }
	            return features;
	        }, []);
	    }
	}
	exports.AxisScorer = AxisScorer;

	});

	var dimension = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DimensionScorer = void 0;


	/**
	 * Penalize if facet channels are the only dimensions
	 */
	class DimensionScorer extends base$1.Scorer {
	    constructor() {
	        super('Dimension');
	    }
	    initScore() {
	        return {
	            row: -2,
	            column: -2,
	            color: 0,
	            opacity: 0,
	            size: 0,
	            shape: 0
	        };
	    }
	    getScore(specM, _, __) {
	        if (specM.isAggregate()) {
	            specM.getEncodings().reduce((maxFScore, encQ) => {
	                if (encoding.isAutoCountQuery(encQ) || (encoding.isFieldQuery(encQ) && !encQ.aggregate)) { // isDimension
	                    const featureScore = this.getFeatureScore(`${encQ.channel}`);
	                    if (featureScore && featureScore.score > maxFScore.score) {
	                        return featureScore;
	                    }
	                }
	                return maxFScore;
	            }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
	        }
	        return [];
	    }
	}
	exports.DimensionScorer = DimensionScorer;

	});

	var facet = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FacetScorer = void 0;
	const CHANNEL = __importStar(require$$0);



	/**
	 * Effective Score for preferred facet
	 */
	class FacetScorer extends base$1.Scorer {
	    constructor() {
	        super('Facet');
	    }
	    initScore(opt) {
	        opt = Object.assign(Object.assign({}, config.DEFAULT_QUERY_CONFIG), opt);
	        let score = {};
	        if (opt.preferredFacet === CHANNEL.ROW) {
	            // penalize the other axis
	            score[CHANNEL.COLUMN] = -0.01;
	        }
	        else if (opt.preferredFacet === CHANNEL.COLUMN) {
	            // penalize the other axis
	            score[CHANNEL.ROW] = -0.01;
	        }
	        return score;
	    }
	    getScore(specM, _, __) {
	        return specM.getEncodings().reduce((features, encQ) => {
	            if (encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) {
	                const featureScore = this.getFeatureScore(encQ.channel);
	                if (featureScore) {
	                    features.push(featureScore);
	                }
	            }
	            return features;
	        }, []);
	    }
	}
	exports.FacetScorer = FacetScorer;

	});

	var sizechannel = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SizeChannelScorer = void 0;


	/**
	 * Effectivenss score that penalize size for bar and tick
	 */
	class SizeChannelScorer extends base$1.Scorer {
	    constructor() {
	        super('SizeChannel');
	    }
	    initScore() {
	        return {
	            bar_size: -2,
	            tick_size: -2
	        };
	    }
	    getScore(specM, _, __) {
	        const mark = specM.getMark();
	        return specM.getEncodings().reduce((featureScores, encQ) => {
	            if (encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) {
	                const feature = `${mark}_${encQ.channel}`;
	                const featureScore = this.getFeatureScore(feature);
	                if (featureScore) {
	                    featureScores.push(featureScore);
	                }
	            }
	            return featureScores;
	        }, []);
	    }
	}
	exports.SizeChannelScorer = SizeChannelScorer;

	});

	var typechannel = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TypeChannelScorer = exports.TERRIBLE = void 0;





	exports.TERRIBLE = -10;
	/**
	 * Effectiveness score for relationship between
	 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
	 */
	class TypeChannelScorer extends base$1.Scorer {
	    constructor() {
	        super('TypeChannel');
	    }
	    initScore() {
	        let SCORE = {};
	        // Continuous Quantitative / Temporal Fields
	        const CONTINUOUS_TYPE_CHANNEL_SCORE = {
	            x: 0,
	            y: 0,
	            size: -0.575,
	            color: -0.725,
	            text: -2,
	            opacity: -3,
	            shape: exports.TERRIBLE,
	            row: exports.TERRIBLE,
	            column: exports.TERRIBLE,
	            detail: 2 * exports.TERRIBLE
	        };
	        [type$3.Q, type$3.T, type$3.TIMEUNIT_T].forEach((type) => {
	            util$1.keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach((channel) => {
	                SCORE[this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
	            });
	        });
	        // Discretized Quantitative / Temporal Fields / Ordinal
	        const ORDERED_TYPE_CHANNEL_SCORE = util$1.extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
	            row: -0.75,
	            column: -0.75,
	            shape: -3.1,
	            text: -3.2,
	            detail: -4
	        });
	        [type$3.BIN_Q, type$3.TIMEUNIT_O, type$3.O].forEach((type) => {
	            util$1.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach((channel) => {
	                SCORE[this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
	            });
	        });
	        const NOMINAL_TYPE_CHANNEL_SCORE = {
	            x: 0,
	            y: 0,
	            color: -0.6,
	            shape: -0.65,
	            row: -0.7,
	            column: -0.7,
	            text: -0.8,
	            detail: -2,
	            size: -3,
	            opacity: -3.1,
	        };
	        util$1.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach((channel) => {
	            SCORE[this.featurize(type$3.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
	            SCORE[this.featurize(type$3.K, channel)] =
	                // Putting key on position or detail isn't terrible
	                util$1.contains(['x', 'y', 'detail'], channel) ? -1 :
	                    NOMINAL_TYPE_CHANNEL_SCORE[channel] - 2;
	        });
	        return SCORE;
	    }
	    featurize(type, channel) {
	        return `${type}_${channel}`;
	    }
	    getScore(specM, schema, opt) {
	        const encodingQueryByField = specM.getEncodings().reduce((m, encQ) => {
	            if (encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) {
	                const fieldKey = shorthand.fieldDef(encQ);
	                (m[fieldKey] = m[fieldKey] || []).push(encQ);
	            }
	            return m;
	        }, {});
	        const features = [];
	        util$1.forEach(encodingQueryByField, (encQs) => {
	            const bestFieldFeature = encQs.reduce((best, encQ) => {
	                if (encoding.isFieldQuery(encQ) || encoding.isAutoCountQuery(encQ)) {
	                    const type = type$3.getExtendedType(encQ);
	                    const feature = this.featurize(type, encQ.channel);
	                    const featureScore = this.getFeatureScore(feature);
	                    if (best === null || featureScore.score > best.score) {
	                        return featureScore;
	                    }
	                }
	                return best;
	            }, null);
	            features.push(bestFieldFeature);
	            // TODO: add plus for over-encoding of one field
	        });
	        return features;
	    }
	}
	exports.TypeChannelScorer = TypeChannelScorer;

	});

	var mark$1 = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.featurize = exports.MarkScorer = void 0;
	const CHANNEL = __importStar(require$$0);
	const MARK = __importStar(require$$1);



	class MarkScorer extends base$1.Scorer {
	    constructor() {
	        super('Mark');
	    }
	    initScore() {
	        return init();
	    }
	    getScore(specM, _, __) {
	        let mark = specM.getMark();
	        if (mark === MARK.CIRCLE || mark === MARK.SQUARE) {
	            mark = MARK.POINT;
	        }
	        const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
	        const xType = xEncQ ? type$3.getExtendedType(xEncQ) : type$3.NONE;
	        const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
	        const yType = yEncQ ? type$3.getExtendedType(yEncQ) : type$3.NONE;
	        const isOccluded = !specM.isAggregate(); // FIXME
	        const feature = `${xType}_${yType}_${isOccluded}_${mark}`;
	        const featureScore = this.getFeatureScore(feature);
	        if (featureScore) {
	            return [featureScore];
	        }
	        console.error('feature score missing for', feature);
	        return [];
	    }
	}
	exports.MarkScorer = MarkScorer;
	function featurize(xType, yType, hasOcclusion, mark) {
	    return `${xType}_${yType}_${hasOcclusion}_${mark}`;
	}
	exports.featurize = featurize;
	function init() {
	    const MEASURES = [type$3.Q, type$3.T];
	    const DISCRETE = [type$3.BIN_Q, type$3.TIMEUNIT_O, type$3.O, type$3.N, type$3.K];
	    const DISCRETE_OR_NONE = DISCRETE.concat([type$3.NONE]);
	    let SCORE = {};
	    // QxQ
	    MEASURES.forEach(xType => {
	        MEASURES.forEach(yType => {
	            // has occlusion
	            const occludedQQMark = {
	                point: 0,
	                text: -0.2,
	                tick: -0.5,
	                rect: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util$1.forEach(occludedQQMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            // no occlusion
	            // TODO: possible to use connected scatter plot
	            const noOccludedQQMark = {
	                point: 0,
	                text: -0.2,
	                tick: -0.5,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util$1.forEach(noOccludedQQMark, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	    });
	    // DxQ, QxD
	    MEASURES.forEach(xType => {
	        // HAS OCCLUSION
	        DISCRETE_OR_NONE.forEach(yType => {
	            const occludedDimensionMeasureMark = {
	                tick: 0,
	                point: -0.2,
	                text: -0.5,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util$1.forEach(occludedDimensionMeasureMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                const feature2 = featurize(yType, xType, true, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type$3.TIMEUNIT_T].forEach(yType => {
	            const occludedDimensionMeasureMark = {
	                // For Time Dimension with time scale, tick is not good
	                point: 0,
	                text: -0.5,
	                tick: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util$1.forEach(occludedDimensionMeasureMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                const feature2 = featurize(yType, xType, true, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        // NO OCCLUSION
	        [type$3.NONE, type$3.N, type$3.O, type$3.K].forEach(yType => {
	            const noOccludedQxN = {
	                bar: 0,
	                point: -0.2,
	                tick: -0.25,
	                text: -0.3,
	                // Line / Area can mislead trend for N
	                line: -2,
	                area: -2,
	                // Non-sense to use rule here
	                rule: -2.5
	            };
	            util$1.forEach(noOccludedQxN, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                const feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type$3.BIN_Q].forEach(yType => {
	            const noOccludedQxBinQ = {
	                bar: 0,
	                point: -0.2,
	                tick: -0.25,
	                text: -0.3,
	                // Line / Area isn't the best fit for bin
	                line: -0.5,
	                area: -0.5,
	                // Non-sense to use rule here
	                rule: -2.5
	            };
	            util$1.forEach(noOccludedQxBinQ, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                const feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type$3.TIMEUNIT_T, type$3.TIMEUNIT_O].forEach(yType => {
	            // For aggregate / surely no occlusion plot, Temporal with time or ordinal
	            // are not that different.
	            const noOccludedQxBinQ = {
	                line: 0,
	                area: -0.1,
	                bar: -0.2,
	                point: -0.3,
	                tick: -0.35,
	                text: -0.4,
	                // Non-sense to use rule here
	                rule: -2.5
	            };
	            util$1.forEach(noOccludedQxBinQ, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                const feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	    });
	    [type$3.TIMEUNIT_T].forEach(xType => {
	        [type$3.TIMEUNIT_T].forEach(yType => {
	            // has occlusion
	            const ttMark = {
	                point: 0,
	                rect: -0.1,
	                text: -0.5,
	                tick: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            // No difference between has occlusion and no occlusion
	            // as most of the time, it will be the occluded case.
	            util$1.forEach(ttMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            util$1.forEach(ttMark, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	        DISCRETE_OR_NONE.forEach(yType => {
	            // has occlusion
	            const tdMark = {
	                tick: 0,
	                point: -0.2,
	                text: -0.5,
	                rect: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            // No difference between has occlusion and no occlusion
	            // as most of the time, it will be the occluded case.
	            util$1.forEach(tdMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            util$1.forEach(tdMark, (score, mark) => {
	                const feature = featurize(yType, xType, true, mark);
	                SCORE[feature] = score;
	            });
	            util$1.forEach(tdMark, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	            util$1.forEach(tdMark, (score, mark) => {
	                const feature = featurize(yType, xType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	    });
	    // DxD
	    // Note: We use for loop here because using forEach sometimes leads to a mysterious bug
	    for (const xType of DISCRETE_OR_NONE) {
	        for (const yType of DISCRETE_OR_NONE) {
	            // has occlusion
	            const ddMark = {
	                point: 0,
	                rect: 0,
	                text: -0.1,
	                tick: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util$1.forEach(ddMark, (score, mark) => {
	                const feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            // same for no occlusion.
	            util$1.forEach(ddMark, (score, mark) => {
	                const feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        }
	    }
	    return SCORE;
	}

	});

	var effectiveness_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.effectiveness = void 0;






	const SCORERS = [
	    new axis$1.AxisScorer(),
	    new dimension.DimensionScorer(),
	    new facet.FacetScorer(),
	    new mark$1.MarkScorer(),
	    new sizechannel.SizeChannelScorer(),
	    new typechannel.TypeChannelScorer()
	];
	// TODO: x/y, row/column preference
	// TODO: stacking
	// TODO: Channel, Cardinality
	// TODO: Penalize over encoding
	function effectiveness(specM, schema, opt) {
	    const features = SCORERS.reduce((f, scorer) => {
	        const scores = scorer.getScore(specM, schema, opt);
	        return f.concat(scores);
	    }, []);
	    return {
	        score: features.reduce((s, f) => {
	            return s + f.score;
	        }, 0),
	        features: features
	    };
	}
	exports.effectiveness = effectiveness;

	});

	var aggregation = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.score = exports.name = void 0;
	const TYPE = __importStar(require$$1$1);


	exports.name = 'aggregationQuality';
	function score(specM, schema, opt) {
	    const feature = aggregationQualityFeature(specM);
	    return {
	        score: feature.score,
	        features: [feature]
	    };
	}
	exports.score = score;
	function aggregationQualityFeature(specM, _, __) {
	    const encodings = specM.getEncodings();
	    if (specM.isAggregate()) {
	        const isRawContinuous = (encQ) => {
	            return (encoding.isFieldQuery(encQ) &&
	                ((encQ.type === TYPE.QUANTITATIVE && !encQ.bin && !encQ.aggregate) ||
	                    (encQ.type === TYPE.TEMPORAL && !encQ.timeUnit)));
	        };
	        if (util$1.some(encodings, isRawContinuous)) {
	            // These are plots that pollute continuous fields as dimension.
	            // They are often intermediate visualizations rather than what users actually want.
	            return {
	                type: exports.name,
	                score: 0.1,
	                feature: 'Aggregate with raw continuous'
	            };
	        }
	        if (util$1.some(encodings, encQ => encoding.isFieldQuery(encQ) && encoding.isDimension(encQ))) {
	            let hasCount = util$1.some(encodings, (encQ) => {
	                return (encoding.isFieldQuery(encQ) && encQ.aggregate === 'count') || encoding.isEnabledAutoCountQuery(encQ);
	            });
	            let hasBin = util$1.some(encodings, (encQ) => {
	                return encoding.isFieldQuery(encQ) && !!encQ.bin;
	            });
	            if (hasCount) {
	                // If there is count, we might add additional count field, making it a little less simple
	                // then when we just apply aggregate to Q field
	                return {
	                    type: exports.name,
	                    score: 0.8,
	                    feature: 'Aggregate with count'
	                };
	            }
	            else if (hasBin) {
	                // This is not as good as binning all the Q and show heatmap
	                return {
	                    type: exports.name,
	                    score: 0.7,
	                    feature: 'Aggregate with bin but without count'
	                };
	            }
	            else {
	                return {
	                    type: exports.name,
	                    score: 0.9,
	                    feature: 'Aggregate without count and without bin'
	                };
	            }
	        }
	        // no dimension -- often not very useful
	        return {
	            type: exports.name,
	            score: 0.3,
	            feature: 'Aggregate without dimension'
	        };
	    }
	    else {
	        if (util$1.some(encodings, encQ => encoding.isFieldQuery(encQ) && !encoding.isDimension(encQ))) {
	            // raw plots with measure -- simplest of all!
	            return {
	                type: exports.name,
	                score: 1,
	                feature: 'Raw with measure'
	            };
	        }
	        // raw plots with no measure -- often a lot of occlusion
	        return {
	            type: exports.name,
	            score: 0.2,
	            feature: 'Raw without measure'
	        };
	    }
	}

	});

	var fieldorder = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.score = exports.name = void 0;

	exports.name = 'fieldOrder';
	/**
	 * Return ranking score based on indices of encoded fields in the schema.
	 * If there are multiple fields, prioritize field on the lower indices of encodings.
	 *
	 * For example, to compare two specs with two encodings each,
	 * first we compare the field on the 0-th index
	 * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
	 */
	function score(specM, schema, _) {
	    const fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
	    if (!fieldWildcardIndices) {
	        return {
	            score: 0,
	            features: []
	        };
	    }
	    const encodings = specM.specQuery.encodings;
	    const numFields = schema.fieldSchemas.length;
	    const features = [];
	    let totalScore = 0;
	    let base = 1;
	    for (let i = fieldWildcardIndices.length - 1; i >= 0; i--) {
	        const index = fieldWildcardIndices[i];
	        const encoding$1 = encodings[index];
	        // Skip ValueQuery as we only care about order of fields.
	        let field;
	        if (encoding.isFieldQuery(encoding$1)) {
	            field = encoding$1.field;
	        }
	        else { // ignore ValueQuery / AutoCountQuery
	            continue;
	        }
	        const fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
	        const fieldIndex = schema.fieldSchema(field).index;
	        // reverse order field with lower index should get higher score and come first
	        const score = -fieldIndex * base;
	        totalScore += score;
	        features.push({
	            score: score,
	            type: 'fieldOrder',
	            feature: `field ${fieldWildcard.name} is ${field} (#${fieldIndex} in the schema)`
	        });
	        base *= numFields;
	    }
	    return {
	        score: totalScore,
	        features: features
	    };
	}
	exports.score = score;

	});

	var ranking = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EFFECTIVENESS = exports.getScore = exports.groupComparatorFactory = exports.comparatorFactory = exports.rank = exports.get = exports.register = exports.fieldOrder = exports.aggregation = void 0;


	__exportStar(effectiveness_1, exports);
	const aggregation$1 = __importStar(aggregation);
	exports.aggregation = aggregation$1;
	const fieldOrder = __importStar(fieldorder);
	exports.fieldOrder = fieldOrder;
	/**
	 * Registry for all encoding ranking functions
	 */
	let rankingRegistry = {};
	/**
	 * Add an ordering function to the registry.
	 */
	function register(name, keyFn) {
	    rankingRegistry[name] = keyFn;
	}
	exports.register = register;
	function get(name) {
	    return rankingRegistry[name];
	}
	exports.get = get;
	function rank(group, query, schema, level) {
	    if (!query.nest || level === query.nest.length) {
	        if (query.orderBy || query.chooseBy) {
	            group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
	            if (query.chooseBy) {
	                if (group.items.length > 0) {
	                    // for chooseBy -- only keep the top-item
	                    group.items.splice(1);
	                }
	            }
	        }
	    }
	    else {
	        // sort lower-level nodes first because our ranking takes top-item in the subgroup
	        group.items.forEach((subgroup) => {
	            rank(subgroup, query, schema, level + 1);
	        });
	        if (query.nest[level].orderGroupBy) {
	            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
	        }
	    }
	    return group;
	}
	exports.rank = rank;
	function comparatorFactory(name, schema, opt) {
	    return (m1, m2) => {
	        if (name instanceof Array) {
	            return getScoreDifference(name, m1, m2, schema, opt);
	        }
	        else {
	            return getScoreDifference([name], m1, m2, schema, opt);
	        }
	    };
	}
	exports.comparatorFactory = comparatorFactory;
	function groupComparatorFactory(name, schema, opt) {
	    return (g1, g2) => {
	        const m1 = result.getTopResultTreeItem(g1);
	        const m2 = result.getTopResultTreeItem(g2);
	        if (name instanceof Array) {
	            return getScoreDifference(name, m1, m2, schema, opt);
	        }
	        else {
	            return getScoreDifference([name], m1, m2, schema, opt);
	        }
	    };
	}
	exports.groupComparatorFactory = groupComparatorFactory;
	function getScoreDifference(name, m1, m2, schema, opt) {
	    for (let rankingName of name) {
	        let scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
	        if (scoreDifference !== 0) {
	            return scoreDifference;
	        }
	    }
	    return 0;
	}
	function getScore(model, rankingName, schema, opt) {
	    if (model.getRankingScore(rankingName) !== undefined) {
	        return model.getRankingScore(rankingName);
	    }
	    const fn = get(rankingName);
	    const score = fn(model, schema, opt);
	    model.setRankingScore(rankingName, score);
	    return score;
	}
	exports.getScore = getScore;
	exports.EFFECTIVENESS = 'effectiveness';
	register(exports.EFFECTIVENESS, effectiveness_1.effectiveness);
	register(aggregation$1.name, aggregation$1.score);
	register(fieldOrder.name, fieldOrder.score);

	});

	var stylize_1 = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.xAxisOnTopForHighYCardinalityWithoutColumn = exports.nominalColorScaleForHighCardinality = exports.smallRangeStepForHighCardinalityOrFacet = exports.stylize = void 0;
	const CHANNEL = __importStar(require$$0);

	const TYPE = __importStar(require$$1$1);


	function stylize(answerSet, schema, opt) {
	    let encQIndex = {};
	    answerSet = answerSet.map(function (specM) {
	        if (opt.smallRangeStepForHighCardinalityOrFacet) {
	            specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
	        }
	        if (opt.nominalColorScaleForHighCardinality) {
	            specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
	        }
	        if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
	            specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
	        }
	        return specM;
	    });
	    return answerSet;
	}
	exports.stylize = stylize;
	function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
	    [CHANNEL.ROW, CHANNEL.Y, CHANNEL.COLUMN, CHANNEL.X].forEach(channel => {
	        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
	    });
	    const yEncQ = encQIndex[CHANNEL.Y];
	    if (yEncQ !== undefined && encoding.isFieldQuery(yEncQ)) {
	        if (encQIndex[CHANNEL.ROW] ||
	            schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
	            // We check for undefined rather than
	            // yEncQ.scale = yEncQ.scale || {} to cover the case where
	            // yEncQ.scale has been set to false/null.
	            // This prevents us from incorrectly overriding scale and
	            // assigning a rangeStep when scale is set to false.
	            if (yEncQ.scale === undefined) {
	                yEncQ.scale = {};
	            }
	            // We do not want to assign a rangeStep if scale is set to false
	            // and we only apply this if the scale is (or can be) an ordinal scale.
	            const yScaleType = encoding.scaleType(yEncQ);
	            if (yEncQ.scale && (yScaleType === undefined || scale_1.hasDiscreteDomain(yScaleType))) {
	                if (!specM.specQuery.height) {
	                    specM.specQuery.height = { step: 12 };
	                }
	            }
	        }
	    }
	    const xEncQ = encQIndex[CHANNEL.X];
	    if (encoding.isFieldQuery(xEncQ)) {
	        if (encQIndex[CHANNEL.COLUMN] ||
	            schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
	            // Just like y, we don't want to do this if scale is null/false
	            if (xEncQ.scale === undefined) {
	                xEncQ.scale = {};
	            }
	            // We do not want to assign a rangeStep if scale is set to false
	            // and we only apply this if the scale is (or can be) an ordinal scale.
	            const xScaleType = encoding.scaleType(xEncQ);
	            if (xEncQ.scale && (xScaleType === undefined || scale_1.hasDiscreteDomain(xScaleType))) {
	                if (!specM.specQuery.width) {
	                    specM.specQuery.width = { step: 12 };
	                }
	            }
	        }
	    }
	    return specM;
	}
	exports.smallRangeStepForHighCardinalityOrFacet = smallRangeStepForHighCardinalityOrFacet;
	function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
	    encQIndex[CHANNEL.COLOR] = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
	    const colorEncQ = encQIndex[CHANNEL.COLOR];
	    if (encoding.isFieldQuery(colorEncQ) &&
	        colorEncQ !== undefined &&
	        (colorEncQ.type === TYPE.NOMINAL || colorEncQ.type === expandedtype.ExpandedType.KEY) &&
	        schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality) {
	        if (colorEncQ.scale === undefined) {
	            colorEncQ.scale = {};
	        }
	        if (colorEncQ.scale) {
	            if (!colorEncQ.scale.range) {
	                colorEncQ.scale.scheme = opt.nominalColorScaleForHighCardinality.palette;
	            }
	        }
	    }
	    return specM;
	}
	exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
	function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
	    [CHANNEL.COLUMN, CHANNEL.X, CHANNEL.Y].forEach(channel => {
	        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
	    });
	    if (encQIndex[CHANNEL.COLUMN] === undefined) {
	        const xEncQ = encQIndex[CHANNEL.X];
	        const yEncQ = encQIndex[CHANNEL.Y];
	        if (encoding.isFieldQuery(xEncQ) &&
	            encoding.isFieldQuery(yEncQ) &&
	            yEncQ !== undefined &&
	            yEncQ.field &&
	            scale_1.hasDiscreteDomain(encoding.scaleType(yEncQ))) {
	            if (xEncQ !== undefined) {
	                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
	                    if (xEncQ.axis === undefined) {
	                        xEncQ.axis = {};
	                    }
	                    if (xEncQ.axis && !xEncQ.axis.orient) {
	                        xEncQ.axis.orient = 'top';
	                    }
	                }
	            }
	        }
	    }
	    return specM;
	}
	exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;

	});

	var generate_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generate = void 0;





	function generate(specQ, schema, opt = config.DEFAULT_QUERY_CONFIG) {
	    // 1. Build a SpecQueryModel, which also contains wildcardIndex
	    const specM = model.SpecQueryModel.build(specQ, schema, opt);
	    const wildcardIndex = specM.wildcardIndex;
	    // 2. Enumerate each of the properties based on propPrecedence.
	    let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
	    opt.propertyPrecedence.forEach((propKey) => {
	        const prop = property.fromKey(propKey);
	        // If the original specQuery contains wildcard for this prop
	        if (wildcardIndex.hasProperty(prop)) {
	            // update answerset
	            const enumerator$1 = enumerator.getEnumerator(prop);
	            const reducer = enumerator$1(wildcardIndex, schema, opt);
	            answerSet = answerSet.reduce(reducer, []);
	        }
	    });
	    if (opt.stylize) {
	        if ((opt.nominalColorScaleForHighCardinality !== null) ||
	            (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
	            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
	            return stylize_1.stylize(answerSet, schema, opt);
	        }
	    }
	    return answerSet;
	}
	exports.generate = generate;

	});

	var recommend_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.recommend = void 0;





	function recommend(q, schema, config$1) {
	    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
	    //    and merge config with the following precedence
	    //    query.config > config > DEFAULT_QUERY_CONFIG
	    q = Object.assign(Object.assign({}, normalize_1.normalize(q)), { config: Object.assign(Object.assign(Object.assign({}, config.DEFAULT_QUERY_CONFIG), config$1), q.config) });
	    // 2. Generate
	    const answerSet = generate_1.generate(q.spec, schema, q.config);
	    const nestedAnswerSet = nest_1.nest(answerSet, q.nest);
	    const result = ranking.rank(nestedAnswerSet, q, schema, 0);
	    return {
	        query: q,
	        result: result
	    };
	}
	exports.recommend = recommend;

	});

	var name = "compassql";
	var version = "0.21.2";
	var description = "CompassQL visualization query language";
	var main$1 = "build/compassql.js";
	var unpkg = "build/compassql.min.js";
	var jsdelivr = "build/compassql.min.js";
	var module = "build/src/cql.ts";
	var types = "build/src/cql.d.ts";
	var typings = "./build/src/cql";
	var directories = {
		test: "test"
	};
	var scripts = {
		prebuild: "mkdir -p build",
		build: "tsc && cp package.json build/src/ && rollup -c",
		"build:examples": "npm run build && ./scripts/build-examples.sh",
		"build:examples-only": "./scripts/build-examples.sh",
		postbuild: "terser build/compassql.js -cm --source-map content=build/compassql.js.map,filename=build/compassql.min.js.map -o build/compassql.min.js",
		clean: "rm -rf build",
		deploy: "npm run clean && npm run lint && npm run test && scripts/deploy.sh",
		lint: "tslint -c tslint.json src/**/*.ts test/**/*.ts",
		schema: "npm run prebuild && typescript-json-schema --required true src/query.ts Query > build/compassql-schema.json",
		test: "jest --maxWorkers=4 && npm run lint",
		"test:inspect": "node --inspect-brk ./node_modules/.bin/jest --runInBand",
		"check:examples": "./scripts/check-examples.sh",
		"watch:build": "npm run build && concurrently --kill-others -n Typescript,Rollup 'tsc -w' 'rollup -c -w'",
		"watch:test": "jest --watch"
	};
	var repository = {
		type: "git",
		url: "git+https://github.com/uwdata/CompassQL.git"
	};
	var keywords = [
		"visualization",
		"recommendation"
	];
	var author = {
		name: "UW Interactive Data Lab",
		url: "http://idl.cs.washington.edu"
	};
	var collaborators = [
		"Kanit Wongsuphasawat <kanitw@gmail.com> (http://kanitw.yellowpigz.com)",
		"Dominik Moritz <domoritz@cs.washington.edu> (http://domoritz.de)",
		"Jeffrey Heer <jheer@uw.edu> (http://jheer.org)"
	];
	var license = "BSD-3-Clause";
	var bugs = {
		url: "https://github.com/uwdata/compassql/issues"
	};
	var homepage = "https://github.com/uwdata/compassql#readme";
	var devDependencies = {
		"@babel/core": "^7.12.3",
		"@babel/plugin-transform-typescript": "^7.12.1",
		"@babel/preset-env": "^7.12.7",
		"@babel/preset-typescript": "^7.12.7",
		"@rollup/plugin-commonjs": "^16.0.0",
		"@rollup/plugin-json": "^4.1.0",
		"@rollup/plugin-node-resolve": "^11.0.1",
		"@types/chai": "^4.2.14",
		"@types/jest": "^26.0.15",
		"babel-jest": "^26.6.3",
		"babel-polyfill": "^6.26.0",
		"babel-preset-es2015": "^6.24.1",
		chai: "^4.2.0",
		concurrently: "^5.3.0",
		jest: "^26.6.3",
		rollup: "^2.33.1",
		"rollup-plugin-sourcemaps": "^0.6.3",
		"source-map-support": "^0.5.19",
		terser: "^5.3.8",
		tslint: "~4.3.1",
		typescript: "^4.0.5",
		"typescript-json-schema": "^0.45.1",
		"vega-datasets": "latest"
	};
	var dependencies = {
		datalib: "~1.9.3",
		vega: "^5.4.0",
		"vega-lite": "^4.17.0",
		"vega-time": "^2.0.4",
		yargs: "^16.1.0"
	};
	var package_json_1 = {
		name: name,
		version: version,
		description: description,
		main: main$1,
		unpkg: unpkg,
		jsdelivr: jsdelivr,
		module: module,
		types: types,
		typings: typings,
		directories: directories,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		collaborators: collaborators,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		dependencies: dependencies
	};

	var src = createCommonjsModule(function (module, exports) {
	/// <reference path="../typings/json.d.ts" />
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.util = exports.schema = exports.result = exports.ranking = exports.query = exports.property = exports.nest = exports.model = exports.wildcard = exports.enumerate = exports.constraint = exports.config = exports.version = exports.recommend = exports.generate = void 0;
	const config$1 = __importStar(config);
	exports.config = config$1;
	const constraint$1 = __importStar(constraint);
	exports.constraint = constraint$1;
	const enumerate = __importStar(enumerator);
	exports.enumerate = enumerate;
	const wildcard$1 = __importStar(wildcard);
	exports.wildcard = wildcard$1;
	const model$1 = __importStar(model);
	exports.model = model$1;
	const nest = __importStar(nest_1);
	exports.nest = nest;
	const property$1 = __importStar(property);
	exports.property = property$1;
	const query$1 = __importStar(query);
	exports.query = query$1;
	const ranking$1 = __importStar(ranking);
	exports.ranking = ranking$1;
	const result$1 = __importStar(result);
	exports.result = result$1;
	const schema$1 = __importStar(schema);
	exports.schema = schema$1;
	const util = __importStar(util$1);
	exports.util = util;

	Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generate_1.generate; } });

	Object.defineProperty(exports, "recommend", { enumerable: true, get: function () { return recommend_1.recommend; } });

	Object.defineProperty(exports, "version", { enumerable: true, get: function () { return package_json_1.version; } });

	});

	var index$1 = /*@__PURE__*/getDefaultExportFromCjs(src);

	return index$1;

})));
//# sourceMappingURL=compassql.js.map
