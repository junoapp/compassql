"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shorthandParser = exports.splitWithTail = exports.parse = exports.fieldDef = exports.encoding = exports.spec = exports.PROPERTY_SUPPORTED_CHANNELS = exports.vlSpec = exports.INCLUDE_ALL = exports.REPLACE_NONE = exports.replace = exports.value = exports.getReplacer = exports.getReplacerIndex = void 0;
const util_1 = require("datalib/src/util");
const aggregate_1 = require("vega-lite/build/src/aggregate");
const channel_1 = require("vega-lite/build/src/channel");
const timeunit_1 = require("vega-lite/build/src/timeunit");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const type_1 = require("vega-lite/build/src/type");
const property_1 = require("../property");
const propindex_1 = require("../propindex");
const util_2 = require("../util");
const wildcard_1 = require("../wildcard");
const encoding_1 = require("./encoding");
const spec_1 = require("./spec");
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
    if (wildcard_1.isWildcard(v)) {
        // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
        if (!wildcard_1.isShortWildcard(v) && v.enum) {
            return wildcard_1.SHORT_WILDCARD + JSON.stringify(v.enum);
        }
        else {
            return wildcard_1.SHORT_WILDCARD;
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
exports.REPLACE_NONE = new propindex_1.PropIndex();
exports.INCLUDE_ALL = 
// FIXME: remove manual TRANSFORM concat once we really support enumerating transform.
[]
    .concat(property_1.DEFAULT_PROP_PRECEDENCE, property_1.SORT_PROPS, [property_1.Property.TRANSFORM, property_1.Property.STACK], property_1.VIEW_PROPS)
    .reduce((pi, prop) => pi.set(prop, true), new propindex_1.PropIndex());
function vlSpec(vlspec, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
    const specQ = spec_1.fromSpec(vlspec);
    return spec(specQ, include, replace);
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
function spec(specQ, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
    const parts = [];
    if (include.get(property_1.Property.MARK)) {
        parts.push(value(specQ.mark, replace.get(property_1.Property.MARK)));
    }
    if (specQ.transform && specQ.transform.length > 0) {
        parts.push(`transform:${JSON.stringify(specQ.transform)}`);
    }
    let stack;
    if (include.get(property_1.Property.STACK)) {
        stack = spec_1.getVlStack(specQ);
    }
    if (specQ.encodings) {
        const encodings = specQ.encodings
            .reduce((encQs, encQ) => {
            // Exclude encoding mapping with autoCount=false as they are basically disabled.
            if (!encoding_1.isDisabledAutoCountQuery(encQ)) {
                let str;
                if (!!stack && encQ.channel === stack.fieldChannel) {
                    str = encoding(Object.assign(Object.assign({}, encQ), { stack: stack.offset }), include, replace);
                }
                else {
                    str = encoding(encQ, include, replace);
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
    for (let viewProp of property_1.VIEW_PROPS) {
        const propString = viewProp.toString();
        if (include.get(viewProp) && !!specQ[propString]) {
            const value = specQ[propString];
            parts.push(`${propString}=${JSON.stringify(value)}`);
        }
    }
    return parts.join('|');
}
exports.spec = spec;
/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function encoding(encQ, include = exports.INCLUDE_ALL, replace = exports.REPLACE_NONE) {
    const parts = [];
    if (include.get(property_1.Property.CHANNEL)) {
        parts.push(value(encQ.channel, replace.get(property_1.Property.CHANNEL)));
    }
    if (encoding_1.isFieldQuery(encQ)) {
        const fieldDefStr = fieldDef(encQ, include, replace);
        if (fieldDefStr) {
            parts.push(fieldDefStr);
        }
    }
    else if (encoding_1.isValueQuery(encQ)) {
        parts.push(encQ.value);
    }
    else if (encoding_1.isAutoCountQuery(encQ)) {
        parts.push('autocount()');
    }
    return parts.join(':');
}
exports.encoding = encoding;
/**
 * Returns a field definition shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function fieldDef(encQ, include = exports.INCLUDE_ALL, replacer = exports.REPLACE_NONE) {
    if (include.get(property_1.Property.AGGREGATE) && encoding_1.isDisabledAutoCountQuery(encQ)) {
        return '-';
    }
    const fn = func(encQ, include, replacer);
    const props = fieldDefProps(encQ, include, replacer);
    let fieldAndParams;
    if (encoding_1.isFieldQuery(encQ)) {
        // field
        fieldAndParams = include.get('field') ? value(encQ.field, replacer.get('field')) : '...';
        // type
        if (include.get(property_1.Property.TYPE)) {
            if (wildcard_1.isWildcard(encQ.type)) {
                fieldAndParams += `,${value(encQ.type, replacer.get(property_1.Property.TYPE))}`;
            }
            else {
                const typeShort = (`${encQ.type || TYPE.QUANTITATIVE}`).substr(0, 1);
                fieldAndParams += `,${value(typeShort, replacer.get(property_1.Property.TYPE))}`;
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
    else if (encoding_1.isAutoCountQuery(encQ)) {
        fieldAndParams = '*,q';
    }
    if (!fieldAndParams) {
        return null;
    }
    if (fn) {
        let fnPrefix = util_1.isString(fn) ? fn : wildcard_1.SHORT_WILDCARD + (util_2.keys(fn).length > 0 ? JSON.stringify(fn) : '');
        return `${fnPrefix}(${fieldAndParams})`;
    }
    return fieldAndParams;
}
exports.fieldDef = fieldDef;
/**
 * Return function part of
 */
function func(fieldQ, include, replacer) {
    if (include.get(property_1.Property.AGGREGATE) && fieldQ.aggregate && !wildcard_1.isWildcard(fieldQ.aggregate)) {
        return replace(fieldQ.aggregate, replacer.get(property_1.Property.AGGREGATE));
    }
    else if (include.get(property_1.Property.AGGREGATE) && encoding_1.isEnabledAutoCountQuery(fieldQ)) {
        // autoCount is considered a part of aggregate
        return replace('count', replacer.get(property_1.Property.AGGREGATE));
    }
    else if (include.get(property_1.Property.TIMEUNIT) && fieldQ.timeUnit && !wildcard_1.isWildcard(fieldQ.timeUnit)) {
        return replace(fieldQ.timeUnit, replacer.get(property_1.Property.TIMEUNIT));
    }
    else if (include.get(property_1.Property.BIN) && fieldQ.bin && !wildcard_1.isWildcard(fieldQ.bin)) {
        return 'bin';
    }
    else {
        let fn = null;
        for (const prop of [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN]) {
            const val = fieldQ[prop];
            if (include.get(prop) && fieldQ[prop] && wildcard_1.isWildcard(val)) {
                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
                fn = fn || {};
                fn[prop] = wildcard_1.isShortWildcard(val) ? val : val.enum;
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
    if (!util_2.isBoolean(fieldQ.bin) && !wildcard_1.isShortWildcard(fieldQ.bin)) {
        const bin = fieldQ.bin;
        for (const child in bin) {
            const prop = property_1.getEncodingNestedProp('bin', child);
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
    for (const parent of [property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.STACK, property_1.Property.AXIS, property_1.Property.LEGEND]) {
        if (!wildcard_1.isWildcard(fieldQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[parent][fieldQ.channel]) {
            continue;
        }
        if (include.get(parent) && fieldQ[parent] !== undefined) {
            const parentValue = fieldQ[parent];
            if (util_2.isBoolean(parentValue) || parentValue === null) {
                // `scale`, `axis`, `legend` can be false/null.
                props.push({
                    key: `${parent}`,
                    value: parentValue || false // return true or false (false if null)
                });
            }
            else if (util_1.isString(parentValue)) {
                // `sort` can be a string (ascending/descending).
                props.push({
                    key: `${parent}`,
                    value: replace(JSON.stringify(parentValue), replacer.get(parent))
                });
            }
            else {
                let nestedPropChildren = [];
                for (const child in parentValue) {
                    const nestedProp = property_1.getEncodingNestedProp(parent, child);
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
        if (channel_1.isChannel(splitPartKey) || splitPartKey === '?') {
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
                if (property_1.isEncodingNestedParent(prop)) {
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
                if (util_2.isArray(fnEnumIndex[encodingProperty])) {
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
//# sourceMappingURL=shorthand.js.map