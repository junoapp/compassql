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
exports.checkSpec = exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS = exports.SpecConstraintModel = void 0;
const aggregate_1 = require("vega-lite/build/src/aggregate");
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const channel_1 = require("vega-lite/build/src/channel");
const MARK = __importStar(require("vega-lite/build/src/mark"));
const scale_1 = require("vega-lite/build/src/scale");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const property_1 = require("../property");
const propindex_1 = require("../propindex");
const encoding_1 = require("../query/encoding");
const expandedtype_1 = require("../query/expandedtype");
const util_1 = require("../util");
const wildcard_1 = require("../wildcard");
const base_1 = require("./base");
const NONPOSITION_CHANNELS_INDEX = channel_1.NONPOSITION_CHANNELS.reduce((m, channel) => {
    m[channel] = true;
    return m;
}, {});
class SpecConstraintModel extends base_1.AbstractConstraintModel {
    constructor(specConstraint) {
        super(specConstraint);
    }
    hasAllRequiredPropertiesSpecific(specM) {
        return util_1.every(this.constraint.properties, prop => {
            if (prop === property_1.Property.MARK) {
                return !wildcard_1.isWildcard(specM.getMark());
            }
            // TODO: transform
            if (property_1.isEncodingNestedProp(prop)) {
                let parent = prop.parent;
                let child = prop.child;
                return util_1.every(specM.getEncodings(), encQ => {
                    if (!encQ[parent]) {
                        return true;
                    }
                    return !wildcard_1.isWildcard(encQ[parent][child]);
                });
            }
            if (!property_1.isEncodingProperty(prop)) {
                throw new Error('UNIMPLEMENTED');
            }
            return util_1.every(specM.getEncodings(), encQ => {
                if (!encQ[prop]) {
                    return true;
                }
                return !wildcard_1.isWildcard(encQ[prop]);
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
        properties: [property_1.Property.CHANNEL],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: (specM, _, __) => {
            let usedChannel = {};
            // channel for all encodings should be valid
            return util_1.every(specM.getEncodings(), encQ => {
                if (!wildcard_1.isWildcard(encQ.channel)) {
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
            property_1.Property.MARK,
            property_1.Property.SCALE,
            property_1.getEncodingNestedProp('scale', 'zero'),
            property_1.Property.CHANNEL,
            property_1.Property.TYPE
        ],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (specM, _, __) => {
            const mark = specM.getMark();
            const encodings = specM.getEncodings();
            if (mark === MARK.BAR) {
                for (let encQ of encodings) {
                    if (encoding_1.isFieldQuery(encQ) &&
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
        properties: [property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: (specM, _, __) => {
            const hasAutoCount = util_1.some(specM.getEncodings(), (encQ) => encoding_1.isEnabledAutoCountQuery(encQ));
            if (hasAutoCount) {
                // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
                return util_1.every(specM.getEncodings(), (encQ) => {
                    if (encoding_1.isValueQuery(encQ)) {
                        return true;
                    }
                    if (encoding_1.isAutoCountQuery(encQ)) {
                        return true;
                    }
                    switch (encQ.type) {
                        case TYPE.QUANTITATIVE:
                            return !!encQ.bin;
                        case TYPE.TEMPORAL:
                            return !!encQ.timeUnit;
                        case TYPE.ORDINAL:
                        case expandedtype_1.ExpandedType.KEY:
                        case TYPE.NOMINAL:
                            return true;
                    }
                    /* istanbul ignore next */
                    throw new Error('Unsupported Type');
                });
            }
            else {
                const autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
                const neverHaveAutoCount = util_1.every(autoCountEncIndex, (index) => {
                    let encQ = specM.getEncodingQueryByIndex(index);
                    return encoding_1.isAutoCountQuery(encQ) && !wildcard_1.isWildcard(encQ.autoCount);
                });
                if (neverHaveAutoCount) {
                    // If the query surely does not have autoCount
                    // then one of the field should be
                    // (1) unbinned quantitative
                    // (2) temporal without time unit
                    // (3) nominal or ordinal field
                    // or at least have potential to be (still ambiguous).
                    return util_1.some(specM.getEncodings(), (encQ) => {
                        if ((encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) && encQ.type === TYPE.QUANTITATIVE) {
                            if (encoding_1.isDisabledAutoCountQuery(encQ)) {
                                return false;
                            }
                            else {
                                return encoding_1.isFieldQuery(encQ) && (!encQ.bin || wildcard_1.isWildcard(encQ.bin));
                            }
                        }
                        else if (encoding_1.isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
                            return !encQ.timeUnit || wildcard_1.isWildcard(encQ.timeUnit);
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
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: (specM, _, __) => {
            const mark = specM.getMark();
            // if mark is unspecified, no need to check
            if (wildcard_1.isWildcard(mark))
                return true;
            // TODO: can optimize this to detect only what's the changed property if needed.
            return util_1.every(specM.getEncodings(), encQ => {
                // channel unspecified, no need to check
                if (wildcard_1.isWildcard(encQ.channel))
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
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
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
                    return (!specM.wildcardIndex.hasProperty(property_1.Property.CHANNEL) ||
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
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
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: (specM, _, opt) => {
            if (specM.isAggregate()) {
                let hasNonFacetDim = false;
                let hasDim = false;
                let hasEnumeratedFacetDim = false;
                specM.specQuery.encodings.forEach((encQ, index) => {
                    if (encoding_1.isValueQuery(encQ) || encoding_1.isDisabledAutoCountQuery(encQ))
                        return; // skip unused field
                    // FieldQuery & !encQ.aggregate
                    if (encoding_1.isFieldQuery(encQ) && !encQ.aggregate) {
                        // isDimension
                        hasDim = true;
                        if (util_1.contains([CHANNEL.ROW, CHANNEL.COLUMN], encQ.channel)) {
                            if (specM.wildcardIndex.hasEncodingProperty(index, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: (specM, _, __) => {
            if (specM.isAggregate()) {
                // TODO relax
                return util_1.some(specM.getEncodings(), (encQ) => {
                    if (encoding_1.isDimension(encQ) || (encoding_1.isFieldQuery(encQ) && encQ.type === 'temporal')) {
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
        properties: [property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: (specM, _, __) => {
            if (util_1.contains([MARK.BAR, MARK.LINE, MARK.AREA], specM.getMark())) {
                return specM.isAggregate();
            }
            return true;
        }
    },
    {
        name: 'omitBarTickWithSize',
        description: 'Do not map field to size channel with bar and tick mark',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: (specM, _, opt) => {
            const mark = specM.getMark();
            if (util_1.contains([MARK.TICK, MARK.BAR], mark)) {
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
                                if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
            property_1.Property.MARK,
            property_1.Property.CHANNEL,
            property_1.Property.SCALE,
            property_1.getEncodingNestedProp('scale', 'type'),
            property_1.Property.TYPE
        ],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (specM, _, __) => {
            const mark = specM.getMark();
            const encodings = specM.getEncodings();
            // TODO: mark or scale type should be enumerated
            if (mark === MARK.AREA || mark === MARK.BAR) {
                for (let encQ of encodings) {
                    if (encoding_1.isFieldQuery(encQ) && ((encQ.channel === CHANNEL.X || encQ.channel === CHANNEL.Y) && encQ.scale)) {
                        let sType = encoding_1.scaleType(encQ);
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
        properties: [property_1.Property.CHANNEL],
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
                if (encoding_1.isValueQuery(encQ) || encoding_1.isDisabledAutoCountQuery(encQ)) {
                    continue; // ignore skipped encoding
                }
                const channel = encQ.channel;
                if (!wildcard_1.isWildcard(channel)) {
                    if (NONPOSITION_CHANNELS_INDEX[`${channel}`]) {
                        nonPositionChannelCount += 1;
                        if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.CHANNEL],
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
                if (encoding_1.isValueQuery(encQ) || encoding_1.isDisabledAutoCountQuery(encQ)) {
                    continue; // ignore skipped encoding
                }
                const channel = encQ.channel;
                if (channel === CHANNEL.X) {
                    hasX = true;
                }
                else if (channel === CHANNEL.Y) {
                    hasY = true;
                }
                else if (!wildcard_1.isWildcard(channel)) {
                    // All non positional channel / Facet
                    hasNonPositionalChannelOrFacet = true;
                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.TYPE],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: (specM, _, opt) => {
            if (specM.isAggregate()) {
                const encodings = specM.specQuery.encodings;
                for (let i = 0; i < encodings.length; i++) {
                    const encQ = encodings[i];
                    if (encoding_1.isValueQuery(encQ) || encoding_1.isDisabledAutoCountQuery(encQ))
                        continue; // skip unused encoding
                    // TODO: aggregate for ordinal and temporal
                    if (encoding_1.isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
                        // Temporal fields should have timeUnit or is still a wildcard
                        if (!encQ.timeUnit &&
                            (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.TIMEUNIT) || opt.constraintManuallySpecifiedValue)) {
                            return false;
                        }
                    }
                    if (encQ.type === TYPE.QUANTITATIVE) {
                        if (encoding_1.isFieldQuery(encQ) && !encQ.bin && !encQ.aggregate) {
                            // If Raw Q
                            if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.BIN) ||
                                specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.AGGREGATE) ||
                                specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.AUTOCOUNT)) {
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
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (specM, _, opt) => {
            if (specM.isAggregate()) {
                return true;
            }
            return util_1.every(specM.specQuery.encodings, (encQ, index) => {
                if (encoding_1.isValueQuery(encQ) || encoding_1.isDisabledAutoCountQuery(encQ))
                    return true; // ignore autoCount field
                if (encQ.channel === CHANNEL.DETAIL) {
                    // Detail channel for raw plot is not good, except when its enumerated
                    // or when it's manually specified but we constraintManuallySpecifiedValue.
                    if (specM.wildcardIndex.hasEncodingProperty(index, property_1.Property.CHANNEL) ||
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
        properties: [property_1.Property.FIELD],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: (specM, _, opt) => {
            let fieldUsed = {};
            let fieldEnumerated = {};
            const encodings = specM.specQuery.encodings;
            for (let i = 0; i < encodings.length; i++) {
                const encQ = encodings[i];
                if (encoding_1.isValueQuery(encQ) || encoding_1.isAutoCountQuery(encQ))
                    continue;
                let field;
                if (encQ.field && !wildcard_1.isWildcard(encQ.field)) {
                    field = encQ.field;
                }
                if (encoding_1.isAutoCountQuery(encQ) && !wildcard_1.isWildcard(encQ.autoCount)) {
                    field = 'count_*';
                }
                if (field) {
                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.FIELD)) {
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
        properties: [property_1.Property.CHANNEL],
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
            property_1.Property.CHANNEL,
            property_1.Property.MARK,
            property_1.Property.TYPE,
            property_1.Property.TIMEUNIT,
            property_1.Property.BIN,
            property_1.Property.AGGREGATE,
            property_1.Property.AUTOCOUNT
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
                        const xIsMeasure = encoding_1.isMeasure(xEncQ);
                        const yIsMeasure = encoding_1.isMeasure(yEncQ);
                        // for aggregate line / area, we need at least one group-by axis and one measure axis.
                        return (xEncQ &&
                            yEncQ &&
                            xIsMeasure !== yIsMeasure &&
                            // and the dimension axis should not be nominal
                            // TODO: make this clause optional
                            !(encoding_1.isFieldQuery(xEncQ) && !xIsMeasure && util_1.contains(['nominal', 'key'], xEncQ.type)) &&
                            !(encoding_1.isFieldQuery(yEncQ) && !yIsMeasure && util_1.contains(['nominal', 'key'], yEncQ.type)));
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
                        const xIsMeasure = encoding_1.isMeasure(xEncQ);
                        const yIsMeasure = encoding_1.isMeasure(yEncQ);
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
                    const xIsDimension = encoding_1.isDimension(xEncQ);
                    const yIsDimension = encoding_1.isDimension(yEncQ);
                    const colorEncQ = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
                    const colorIsQuantitative = encoding_1.isMeasure(colorEncQ);
                    const colorIsOrdinal = encoding_1.isFieldQuery(colorEncQ) ? colorEncQ.type === TYPE.ORDINAL : false;
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
            property_1.Property.STACK,
            property_1.Property.FIELD,
            property_1.Property.CHANNEL,
            property_1.Property.MARK,
            property_1.Property.AGGREGATE,
            property_1.Property.AUTOCOUNT,
            property_1.Property.SCALE,
            property_1.getEncodingNestedProp('scale', 'type'),
            property_1.Property.TYPE
        ],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (specM, _, __) => {
            if (!specM.wildcardIndex.hasProperty(property_1.Property.STACK)) {
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
            property_1.Property.CHANNEL,
            property_1.Property.MARK,
            property_1.Property.AGGREGATE,
            property_1.Property.AUTOCOUNT,
            property_1.Property.SCALE,
            property_1.getEncodingNestedProp('scale', 'type'),
            property_1.Property.TYPE
        ],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (specM, _, __) => {
            const specStack = specM.getVlStack();
            if (specStack != null) {
                const stackParentEncQ = specM.getEncodingQueryByChannel(specStack.fieldChannel);
                if (!util_1.contains(aggregate_1.SUM_OPS, stackParentEncQ.aggregate)) {
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
            property_1.Property.CHANNEL,
            property_1.Property.TYPE,
            property_1.Property.TIMEUNIT,
            property_1.Property.BIN,
            property_1.Property.AGGREGATE,
            property_1.Property.AUTOCOUNT
        ],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: (specM, _, opt) => {
            if (opt.autoAddCount) {
                const xEncQ = specM.getEncodingQueryByChannel('x');
                const yEncQ = specM.getEncodingQueryByChannel('y');
                if ((!encoding_1.isFieldQuery(xEncQ) || encoding_1.isDimension(xEncQ)) && (!encoding_1.isFieldQuery(yEncQ) || encoding_1.isDimension(yEncQ))) {
                    if (!specM.isAggregate()) {
                        return false;
                    }
                    else {
                        return util_1.every(specM.getEncodings(), encQ => {
                            let channel = encQ.channel;
                            if (channel !== CHANNEL.X &&
                                channel !== CHANNEL.Y &&
                                channel !== CHANNEL.ROW &&
                                channel !== CHANNEL.COLUMN) {
                                // Non-position fields should not be unaggreated fields
                                if (encoding_1.isFieldQuery(encQ) && !encQ.aggregate) {
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
}, new propindex_1.PropIndex());
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
//# sourceMappingURL=spec.js.map