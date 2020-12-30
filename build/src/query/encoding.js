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
exports.scaleType = exports.isDimension = exports.isMeasure = exports.isContinuous = exports.toFieldDef = exports.toValueDef = exports.toEncoding = exports.isEnabledAutoCountQuery = exports.isDisabledAutoCountQuery = exports.isAutoCountQuery = exports.isFieldQuery = exports.isValueQuery = void 0;
const util_1 = require("datalib/src/util");
const vlChannelDef = __importStar(require("vega-lite/build/src/channeldef"));
const type_1 = require("vega-lite/build/src/compile/scale/type");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const property_1 = require("../property");
const wildcard_1 = require("../wildcard");
const expandedtype_1 = require("./expandedtype");
const shorthand_1 = require("./shorthand");
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
    property_1.Property.AGGREGATE,
    property_1.Property.BIN,
    property_1.Property.TIMEUNIT,
    property_1.Property.FIELD,
    property_1.Property.TYPE,
    property_1.Property.SCALE,
    property_1.Property.SORT,
    property_1.Property.AXIS,
    property_1.Property.LEGEND,
    property_1.Property.STACK,
    property_1.Property.FORMAT
];
function toEncoding(encQs, params) {
    const { wildcardMode = 'skip' } = params;
    let encoding = {};
    for (const encQ of encQs) {
        if (isDisabledAutoCountQuery(encQ)) {
            continue; // Do not include this in the output.
        }
        const { channel } = encQ;
        // if channel is a wildcard, return null
        if (wildcard_1.isWildcard(channel)) {
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
    if (wildcard_1.isWildcard(value)) {
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
            if (wildcard_1.isWildcard(encodingProperty)) {
                if (wildcardMode === 'skip')
                    continue;
                return null;
            }
            if (encodingProperty !== undefined) {
                // if the channel supports this prop
                const isSupportedByChannel = !shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop] || shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel];
                if (!isSupportedByChannel) {
                    continue;
                }
                if (property_1.isEncodingNestedParent(prop) && util_1.isObject(encodingProperty)) {
                    encodingProperty = Object.assign({}, encodingProperty); // Make a shallow copy first
                    for (const childProp in encodingProperty) {
                        // ensure nested properties are not wildcard before assigning to field def
                        if (wildcard_1.isWildcard(encodingProperty[childProp])) {
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
            if (prop === property_1.Property.SCALE && schema && encQ.type === TYPE.ORDINAL) {
                const scale = encQ.scale;
                const { ordinalDomain } = schema.fieldSchema(encQ.field);
                if (scale !== null && ordinalDomain) {
                    fieldDef[property_1.Property.SCALE] = Object.assign({ domain: ordinalDomain }, (util_1.isObject(scale) ? scale : {}));
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
    const scale = fieldQ.scale === true || fieldQ.scale === wildcard_1.SHORT_WILDCARD ? {} : fieldQ.scale || {};
    const { type, channel, timeUnit, bin } = fieldQ;
    // HACK: All of markType, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark,
    // we will just call it with mark = undefined .
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    const markType = undefined;
    if (wildcard_1.isWildcard(scale.type) || wildcard_1.isWildcard(type) || wildcard_1.isWildcard(channel) || wildcard_1.isWildcard(bin)) {
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
    if (type === 'temporal' && wildcard_1.isWildcard(timeUnit)) {
        return undefined;
    }
    // if type is fixed and it's not quantitative, we can ignore bin
    if (type === 'quantitative' && wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    let vegaLiteType = type === expandedtype_1.ExpandedType.KEY ? 'nominal' : type;
    const fieldDef = {
        type: vegaLiteType,
        timeUnit: timeUnit,
        bin: bin
    };
    return type_1.scaleType({ type: scale.type }, channel, fieldDef, markType);
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map