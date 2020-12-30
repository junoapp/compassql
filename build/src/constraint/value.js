"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALUE_CONSTRAINTS_BY_PROPERTY = exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS = void 0;
const property_1 = require("../property");
const propindex_1 = require("../propindex");
const util_1 = require("../util");
const base_1 = require("./base");
exports.VALUE_CONSTRAINTS = [
    {
        name: 'doesNotSupportConstantValue',
        description: 'row, column, x, y, order, and detail should not work with constant values.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (valueQ, _, __, ___) => {
            return !(util_1.contains(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
        }
    }
].map((ec) => new base_1.EncodingConstraintModel(ec));
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
}, new propindex_1.PropIndex());
//# sourceMappingURL=value.js.map