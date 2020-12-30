"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropIndex = void 0;
const util_1 = require("./util");
const property_1 = require("./property");
/**
 * Dictionary that takes property as a key.
 */
class PropIndex {
    constructor(i = null) {
        this.index = i ? Object.assign({}, i) : {};
    }
    has(p) {
        return property_1.toKey(p) in this.index;
    }
    get(p) {
        return this.index[property_1.toKey(p)];
    }
    set(p, value) {
        this.index[property_1.toKey(p)] = value;
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
        return util_1.keys(this.index).length;
    }
    duplicate() {
        return new PropIndex(this.index);
    }
}
exports.PropIndex = PropIndex;
//# sourceMappingURL=propindex.js.map