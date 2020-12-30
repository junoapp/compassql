"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagKeys = exports.without = exports.nestedMap = exports.some = exports.forEach = exports.every = exports.contains = exports.isArray = exports.toMap = exports.isBoolean = exports.isObject = exports.extend = exports.duplicate = exports.keys = exports.cmp = void 0;
const util_1 = require("datalib/src/util");
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return util_1.isArray; } });
var util_2 = require("datalib/src/util");
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
;
function every(arr, f) {
    for (let i = 0; i < arr.length; i++) {
        if (!f(arr[i], i)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
;
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
;
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
;
function nestedMap(array, f) {
    return array.map((a) => {
        if (util_1.isArray(a)) {
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
//# sourceMappingURL=util.js.map