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
exports.extendConfig = exports.DEFAULT_QUERY_CONFIG = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const property_1 = require("./property");
const wildcard_1 = require("./wildcard");
exports.DEFAULT_QUERY_CONFIG = {
    verbose: false,
    defaultSpecConfig: {
        line: { point: true },
        scale: { useUnaggregatedDomain: true }
    },
    propertyPrecedence: property_1.DEFAULT_PROP_PRECEDENCE.map(property_1.toKey),
    enum: wildcard_1.DEFAULT_ENUM_INDEX,
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
    const enumOpt = Object.assign(Object.assign(Object.assign({}, wildcard_1.DEFAULT_ENUM_INDEX), enumIndex), { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
    return enumOpt;
}
function extendNestedEnumIndex(enumIndex, prop) {
    return Object.assign(Object.assign({}, wildcard_1.DEFAULT_ENUM_INDEX[`${prop}Props`]), enumIndex[`${prop}Props`]);
}
//# sourceMappingURL=config.js.map