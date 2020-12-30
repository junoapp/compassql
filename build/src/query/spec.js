"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasWildcard = exports.hasRequiredStackProperties = exports.getStackChannel = exports.getStackOffset = exports.getVlStack = exports.isAggregate = exports.fromSpec = void 0;
const util_1 = require("datalib/src/util");
const stack_1 = require("vega-lite/build/src/stack");
const property_1 = require("../property");
const util_2 = require("../util");
const wildcard_1 = require("../wildcard");
const encoding_1 = require("./encoding");
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
function fromSpec(spec) {
    return util_2.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, spec.background ? { background: spec.background } : {}, spec.padding ? { padding: spec.padding } : {}, spec.title ? { title: spec.title } : {}, {
        mark: spec.mark,
        encodings: util_2.keys(spec.encoding).map((channel) => {
            let encQ = { channel: channel };
            let channelDef = spec.encoding[channel];
            for (const prop in channelDef) {
                if (property_1.isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
                    // Currently bin, scale, axis, legend only support boolean, but not null.
                    // Therefore convert null to false.
                    if (util_2.contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                        encQ[prop] = false;
                    }
                    else {
                        encQ[prop] = channelDef[prop];
                    }
                }
            }
            if (encoding_1.isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
                encQ.field = '*';
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
exports.fromSpec = fromSpec;
function isAggregate(specQ) {
    return util_2.some(specQ.encodings, (encQ) => {
        return (encoding_1.isFieldQuery(encQ) && !wildcard_1.isWildcard(encQ.aggregate) && !!encQ.aggregate) || encoding_1.isEnabledAutoCountQuery(encQ);
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
    const encoding = encoding_1.toEncoding(specQ.encodings, { schema: null, wildcardMode: 'null' });
    const mark = specQ.mark;
    return stack_1.stack(mark, encoding, { disallowNonLinearStack: true });
}
exports.getVlStack = getVlStack;
/**
 * @return The `StackOffset` specified in `specQ`, `undefined` if none
 * is specified.
 */
function getStackOffset(specQ) {
    for (const encQ of specQ.encodings) {
        if (encQ[property_1.Property.STACK] !== undefined && !wildcard_1.isWildcard(encQ[property_1.Property.STACK])) {
            return encQ[property_1.Property.STACK];
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
        if (encQ[property_1.Property.STACK] !== undefined && !wildcard_1.isWildcard(encQ.channel)) {
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
    if (wildcard_1.isWildcard(specQ.mark)) {
        return false;
    }
    const requiredEncodingProps = [
        property_1.Property.STACK,
        property_1.Property.CHANNEL,
        property_1.Property.MARK,
        property_1.Property.FIELD,
        property_1.Property.AGGREGATE,
        property_1.Property.AUTOCOUNT,
        property_1.Property.SCALE,
        property_1.getEncodingNestedProp('scale', 'type'),
        property_1.Property.TYPE
    ];
    const exclude = util_1.toMap(util_2.without(property_1.ALL_ENCODING_PROPS, requiredEncodingProps));
    const encodings = specQ.encodings.filter(encQ => !encoding_1.isDisabledAutoCountQuery(encQ));
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
    if (!util_2.isObject(obj)) {
        return false;
    }
    for (const childProp in obj) {
        if (obj.hasOwnProperty(childProp)) {
            const wildcard = wildcard_1.isWildcard(obj[childProp]);
            if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) || objectContainsWildcard(obj[childProp], opt)) {
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
    const exclude = opt.exclude ? util_1.toMap(opt.exclude.map(property_1.toKey)) : {};
    if (wildcard_1.isWildcard(specQ.mark) && !exclude['mark']) {
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
//# sourceMappingURL=spec.js.map