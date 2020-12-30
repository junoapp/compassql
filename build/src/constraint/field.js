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
exports.FIELD_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINT_INDEX = exports.FIELD_CONSTRAINTS = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const channeldef_1 = require("vega-lite/build/src/channeldef");
const scale_1 = require("vega-lite/build/src/scale");
const timeunit_1 = require("vega-lite/build/src/timeunit");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const property_1 = require("../property");
const propindex_1 = require("../propindex");
const encoding_1 = require("../query/encoding");
const expandedtype_1 = require("../query/expandedtype");
const schema_1 = require("../schema");
const util_1 = require("../util");
const wildcard_1 = require("../wildcard");
const base_1 = require("./base");
exports.FIELD_CONSTRAINTS = [
    {
        name: 'aggregateOpSupportedByType',
        description: 'Aggregate function should be supported by data type.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (fieldQ.aggregate) {
                return !expandedtype_1.isDiscrete(fieldQ.type);
            }
            // TODO: some aggregate function are actually supported by ordinal
            return true; // no aggregate is okay with any type.
        }
    },
    {
        name: 'asteriskFieldWithCountOnly',
        description: 'Field="*" should be disallowed except aggregate="count"',
        properties: [property_1.Property.FIELD, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
        }
    },
    {
        name: 'minCardinalityForBin',
        description: 'binned quantitative field should not have too low cardinality',
        properties: [property_1.Property.BIN, property_1.Property.FIELD, property_1.Property.TYPE],
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
        properties: [property_1.Property.TYPE, property_1.Property.BIN],
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
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
            var _a;
            const fieldDef = Object.assign({ field: 'f' }, encoding_1.toFieldDef(fieldQ, { schema, props: ['bin', 'timeUnit', 'type'] }));
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
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
        properties: [property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'zero'), property_1.Property.BIN],
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (encoding_1.isFieldQuery(fieldQ)) {
                const numFn = (!wildcard_1.isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
                    (!wildcard_1.isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
                    (!wildcard_1.isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
                return numFn <= 1;
            }
            // For autoCount there is always only one type of function
            return true;
        }
    },
    {
        name: 'timeUnitAppliedForTemporal',
        description: 'Time unit should be applied to temporal field only.',
        properties: [property_1.Property.TYPE, property_1.Property.TIMEUNIT],
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
        properties: [property_1.Property.TIMEUNIT, property_1.Property.TYPE],
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
        properties: [].concat(property_1.SCALE_PROPS, [property_1.Property.SCALE, property_1.Property.TYPE]),
        allowWildcardForProperties: true,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (fieldQ.scale) {
                const scale = fieldQ.scale;
                //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
                //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
                //  what the scale type is, and thus can ignore the constraint.
                const sType = encoding_1.scaleType(fieldQ);
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
        properties: [].concat(property_1.SCALE_PROPS, [property_1.Property.SCALE, property_1.Property.CHANNEL]),
        allowWildcardForProperties: true,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (fieldQ) {
                let channel = fieldQ.channel;
                let scale = fieldQ.scale;
                if (channel && !wildcard_1.isWildcard(channel) && scale) {
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
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
            if (fieldQ.field === '*') {
                return true;
            }
            const primitiveType = schema.primitiveType(fieldQ.field);
            const type = fieldQ.type;
            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            switch (primitiveType) {
                case schema_1.PrimitiveType.BOOLEAN:
                case schema_1.PrimitiveType.STRING:
                    return type !== TYPE.QUANTITATIVE && type !== TYPE.TEMPORAL;
                case schema_1.PrimitiveType.NUMBER:
                case schema_1.PrimitiveType.INTEGER:
                    return type !== TYPE.TEMPORAL;
                case schema_1.PrimitiveType.DATETIME:
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
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
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
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: (fieldQ, schema, _, opt) => {
            // TODO: missing case where ordinal / temporal use categorical color
            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
            if (fieldQ.channel === CHANNEL.COLOR && (fieldQ.type === TYPE.NOMINAL || fieldQ.type === expandedtype_1.ExpandedType.KEY)) {
                return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
            }
            return true; // other channel is irrelevant to this constraint
        }
    },
    {
        name: 'maxCardinalityForFacet',
        description: 'Row/column channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
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
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
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
            property_1.Property.TYPE,
            property_1.Property.SCALE,
            property_1.getEncodingNestedProp('scale', 'type'),
            property_1.Property.TIMEUNIT,
            property_1.Property.BIN
        ],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (fieldQ.scale) {
                const type = fieldQ.type;
                const sType = encoding_1.scaleType(fieldQ);
                if (expandedtype_1.isDiscrete(type)) {
                    return sType === undefined || scale_1.hasDiscreteDomain(sType);
                }
                else if (type === TYPE.TEMPORAL) {
                    if (!fieldQ.timeUnit) {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType) || scale_1.hasDiscreteDomain(sType);
                    }
                }
                else if (type === TYPE.QUANTITATIVE) {
                    if (fieldQ.bin) {
                        return util_1.contains([scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                    else {
                        return util_1.contains([
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
        properties: [property_1.Property.STACK, property_1.Property.CHANNEL],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (fieldQ, _, __, ___) => {
            if (!!fieldQ.stack) {
                return fieldQ.channel === CHANNEL.X || fieldQ.channel === CHANNEL.Y;
            }
            return true;
        }
    }
].map((ec) => new base_1.EncodingConstraintModel(ec));
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
}, new propindex_1.PropIndex());
//# sourceMappingURL=field.js.map