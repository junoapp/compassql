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
const chai_1 = require("chai");
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const channel_1 = require("vega-lite/build/src/channel");
const scale_1 = require("vega-lite/build/src/scale");
const vegaTime = __importStar(require("vega-time"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../../src/config");
const base_1 = require("../../src/constraint/base");
const field_1 = require("../../src/constraint/field");
const property_1 = require("../../src/property");
const propindex_1 = require("../../src/propindex");
const util_1 = require("../../src/util");
const wildcard_1 = require("../../src/wildcard");
const fixture_1 = require("../fixture");
const wildcard_2 = require("../../src/wildcard");
describe('constraints/field', () => {
    const defaultOpt = config_1.DEFAULT_QUERY_CONFIG;
    const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, {
        constraintManuallySpecifiedValue: true
    });
    // Make sure all non-strict constraints have their configs.
    field_1.FIELD_CONSTRAINTS.forEach(constraint => {
        if (!constraint.strict()) {
            it(`${constraint.name()} should have default config for all non-strict constraints`, () => {
                chai_1.assert.isDefined(config_1.DEFAULT_QUERY_CONFIG[constraint.name()]);
            });
        }
    });
    describe('hasAllRequiredPropertiesSpecific', () => {
        let encModel = new base_1.EncodingConstraintModel({
            name: 'TestEncoding for hasAllRequiredProperties class method',
            description: 'TestEncoding for hasAllRequirdProperties class method',
            properties: [property_1.Property.AGGREGATE, property_1.Property.TYPE, property_1.Property.SCALE, { parent: 'scale', child: 'type' }],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: undefined
        });
        it('should return true if all properties is defined', () => {
            let encQ = {
                channel: CHANNEL.X,
                aggregate: 'mean',
                field: 'A',
                scale: { type: scale_1.ScaleType.LOG },
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(encModel.hasAllRequiredPropertiesSpecific(encQ));
        });
        it('should return true if a required property is undefined', () => {
            let encQ = {
                channel: CHANNEL.X,
                field: 'A',
                scale: { type: scale_1.ScaleType.LOG },
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(encModel.hasAllRequiredPropertiesSpecific(encQ));
        });
        it('should return false if a required property is a wildcard', () => {
            let encQ = {
                channel: CHANNEL.X,
                aggregate: wildcard_1.SHORT_WILDCARD,
                scale: { type: scale_1.ScaleType.LOG },
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isFalse(encModel.hasAllRequiredPropertiesSpecific(encQ));
        });
        it('should return false if a nested required property is a wildcard', () => {
            let encQ = {
                channel: CHANNEL.X,
                aggregate: 'mean',
                field: 'A',
                scale: { type: wildcard_1.SHORT_WILDCARD },
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isFalse(encModel.hasAllRequiredPropertiesSpecific(encQ));
        });
    });
    describe('aggregateOpSupportedByType', () => {
        let encQ = {
            channel: CHANNEL.X,
            aggregate: 'mean',
            field: 'A',
            type: undefined
        };
        it('should return false if aggregate is applied to non-quantitative type', () => {
            [TYPE.NOMINAL, TYPE.ORDINAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return true if aggregate is applied to quantitative field', () => {
            // TODO: verify if this really works with temporal
            [TYPE.QUANTITATIVE, TYPE.TEMPORAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
    });
    describe('asteriskFieldWithCountOnly', () => {
        it('should return true for field=* and aggregate=COUNT', () => {
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['asteriskFieldWithCountOnly'].satisfy({ channel: CHANNEL.X, aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE }, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false for field=* without aggregate=COUNT', () => {
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['asteriskFieldWithCountOnly'].satisfy({ channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE }, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false for aggregate=COUNT without field=*', () => {
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['asteriskFieldWithCountOnly'].satisfy({ channel: CHANNEL.X, aggregate: 'count', field: 'haha', type: TYPE.QUANTITATIVE }, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('minCardinalityForBin', () => {
        it('should return false for binned quantitative field that has low cardinality', () => {
            ['Q5', 'Q10'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.X,
                    bin: true,
                    field: field,
                    type: TYPE.QUANTITATIVE
                };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['minCardinalityForBin'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return true for binned quantitative field that has high enough cardinality', () => {
            ['Q15', 'Q20', 'Q'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.X,
                    bin: true,
                    field: field,
                    type: TYPE.QUANTITATIVE
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['minCardinalityForBin'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
    });
    describe('binAppliedForQuantitative', () => {
        let encQ = {
            channel: CHANNEL.X,
            bin: true,
            field: 'A',
            type: undefined
        };
        it('should return false if bin is applied to non-quantitative type', () => {
            [TYPE.NOMINAL, TYPE.ORDINAL, TYPE.TEMPORAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return true if bin is applied to quantitative type', () => {
            encQ.type = TYPE.QUANTITATIVE;
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true for any non-binned field', () => {
            encQ.bin = undefined;
            [TYPE.NOMINAL, TYPE.ORDINAL, TYPE.TEMPORAL, TYPE.QUANTITATIVE].forEach(type => {
                encQ.type = type;
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
    });
    describe('channelFieldCompatible', () => {
        [CHANNEL.X, CHANNEL.Y, CHANNEL.COLOR, CHANNEL.TEXT, CHANNEL.DETAIL].forEach(channel => {
            it(`${channel} supports raw measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports aggregate measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean' };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports aggregate measure.`, () => {
                const encQ = { channel: channel, type: TYPE.QUANTITATIVE, autoCount: true };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports raw temporal measure.`, () => {
                const encQ = { channel: channel, field: 'T', type: TYPE.TEMPORAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports timeUnit temporal dimension.`, () => {
                const encQ = { channel: channel, field: 'T', type: TYPE.QUANTITATIVE, timeUnit: vegaTime.MONTH };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports binned quantitative dimension.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, bin: true };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports ordinal dimension.`, () => {
                const encQ = { channel: channel, field: 'O', type: TYPE.ORDINAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports nominal dimension.`, () => {
                const encQ = { channel: channel, field: 'N', type: TYPE.NOMINAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        [CHANNEL.ROW, CHANNEL.COLUMN].forEach(channel => {
            it(`${channel} does not support raw measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} does not support aggregate measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean' };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} does not support raw temporal measure.`, () => {
                const encQ = { channel: channel, field: 'T', type: TYPE.TEMPORAL };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports timeUnit temporal dimension.`, () => {
                for (const type of [TYPE.ORDINAL, TYPE.TEMPORAL]) {
                    const encQ = { channel: channel, field: 'T', type, timeUnit: vegaTime.MONTH };
                    chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
                }
            });
            it(`${channel} supports binned quantitative dimension.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, bin: true };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports ordinal dimension.`, () => {
                const encQ = { channel: channel, field: 'O', type: TYPE.ORDINAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports nominal dimension.`, () => {
                const encQ = { channel: channel, field: 'N', type: TYPE.NOMINAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        [CHANNEL.SIZE].forEach(channel => {
            it(`${channel} supports raw measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports aggregate measure.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean' };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports raw temporal measure.`, () => {
                const encQ = { channel: channel, field: 'T', type: TYPE.TEMPORAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports timeUnit dimension.`, () => {
                const encQ = { channel: channel, field: 'T', type: TYPE.ORDINAL, timeUnit: vegaTime.MONTH };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports binned quantitative dimension.`, () => {
                const encQ = { channel: channel, field: 'Q', type: TYPE.QUANTITATIVE, bin: true };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} supports ordinal dimension.`, () => {
                const encQ = { channel: channel, field: 'O', type: TYPE.ORDINAL };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
            it(`${channel} does not support nominal dimension.`, () => {
                const encQ = { channel: channel, field: 'N', type: TYPE.NOMINAL };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['channelFieldCompatible'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
    });
    describe('hasFn', () => {
        it('should return true if encQ has no hasFn', () => {
            const encQ = {
                channel: CHANNEL.COLOR,
                field: 'Q',
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['hasFn'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false if encQ has hasFn = true and has no function', () => {
            const encQ = {
                hasFn: true,
                channel: CHANNEL.COLOR,
                field: 'Q',
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['hasFn'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if encQ has hasFn = true and has aggregate', () => {
            const encQ = {
                hasFn: true,
                channel: CHANNEL.COLOR,
                aggregate: 'mean',
                field: 'Q',
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['hasFn'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if encQ has hasFn = true and has bin', () => {
            const encQ = {
                hasFn: true,
                channel: CHANNEL.COLOR,
                bin: true,
                field: 'Q',
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['hasFn'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if encQ has hasFn = true and has timeUnit', () => {
            const encQ = {
                hasFn: true,
                channel: CHANNEL.COLOR,
                timeUnit: vegaTime.HOURS,
                field: 'T',
                type: TYPE.TEMPORAL
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['hasFn'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('maxCardinalityForCategoricalColor', () => {
        it('should return true for nominal color that has low cardinality', () => {
            ['O', 'O_10', 'O_20'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.COLOR,
                    field: field,
                    type: TYPE.NOMINAL
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForCategoricalColor'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return false for nominal color that has high cardinality', () => {
            ['O_100'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.COLOR,
                    field: field,
                    type: TYPE.NOMINAL
                };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForCategoricalColor'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        // TODO: timeUnit with categorical color scale
        // TODO: bin with categorical color scale
    });
    describe('maxCardinalityForFacet', () => {
        it('should return true for nominal field that has low cardinality', () => {
            [CHANNEL.ROW, CHANNEL.COLUMN].forEach(channel => {
                ['O', 'O_10'].forEach(field => {
                    const encQ = {
                        channel: channel,
                        field: field,
                        type: TYPE.NOMINAL
                    };
                    chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForFacet'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
                });
            });
        });
        it('should return false for nominal field that has high cardinality', () => {
            [CHANNEL.ROW, CHANNEL.COLUMN].forEach(channel => {
                ['O_100'].forEach(field => {
                    const encQ = {
                        channel: channel,
                        field: field,
                        type: TYPE.NOMINAL
                    };
                    chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForFacet'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
                });
            });
        });
        // TODO: timeUnit
        // TODO: bin
    });
    describe('maxCardinalityForShape', () => {
        it('should return true for nominal shape that has low cardinality', () => {
            ['O'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.SHAPE,
                    field: field,
                    type: TYPE.NOMINAL
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForShape'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return false for nominal shape that has high cardinality', () => {
            ['O_10', 'O_20', 'O_100'].forEach(field => {
                const encQ = {
                    channel: CHANNEL.SHAPE,
                    field: field,
                    type: TYPE.NOMINAL
                };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['maxCardinalityForShape'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        // TODO: timeUnit
        // TODO: bin
    });
    describe('omitBinWithLogScale', () => {
        it('bin should not support log scale', () => {
            const encQ = {
                channel: CHANNEL.X,
                field: 'Q',
                bin: true,
                scale: { type: scale_1.ScaleType.LOG },
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['dataTypeAndFunctionMatchScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('omitScaleZeroWithBinnedField', () => {
        let encQ = {
            channel: CHANNEL.X,
            bin: true,
            field: 'A',
            scale: { zero: undefined },
            type: TYPE.QUANTITATIVE
        };
        it('should return false if scale zero is used with binned field', () => {
            encQ.scale.zero = true;
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['omitScaleZeroWithBinnedField'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if scale zero is not used with binned field', () => {
            encQ.scale.zero = false;
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['omitScaleZeroWithBinnedField'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('dataTypeAndFunctionMatchScaleType', () => {
        [scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT, scale_1.ScaleType.BAND].forEach(scaleType => {
            it(`scaleType of ${scaleType} matches data type ordinal with timeUnit`, () => {
                const encQ = {
                    channel: CHANNEL.X,
                    field: 'O',
                    scale: { type: scaleType },
                    type: TYPE.ORDINAL,
                    timeUnit: vegaTime.MINUTES
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['dataTypeAndFunctionMatchScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        [scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT, scale_1.ScaleType.BAND].forEach(scaleType => {
            it(`scaleType of ${scaleType} matches data type nominal`, () => {
                const encQ = {
                    channel: CHANNEL.X,
                    field: 'N',
                    scale: { type: scaleType },
                    type: TYPE.NOMINAL,
                    timeUnit: vegaTime.MINUTES
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['dataTypeAndFunctionMatchScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        [scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT, scale_1.ScaleType.BAND].forEach(scaleType => {
            it(`scaleType of ${scaleType} matches data type temporal`, () => {
                const encQ = {
                    channel: CHANNEL.X,
                    field: 'T',
                    scale: { type: scaleType },
                    type: TYPE.TEMPORAL,
                    timeUnit: vegaTime.MINUTES
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['dataTypeAndFunctionMatchScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        [
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.LINEAR
        ].forEach(scaleType => {
            it(`scaleType of ${scaleType} matches data type quantitative`, () => {
                const encQ = { channel: CHANNEL.X, field: 'Q', scale: { type: scaleType }, type: TYPE.QUANTITATIVE };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['dataTypeAndFunctionMatchScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
    });
    describe('onlyOneTypeOfFunction', () => {
        const encQ = {
            channel: CHANNEL.X,
            field: 'A',
            type: TYPE.QUANTITATIVE
        };
        it('should return true if there is no function', () => {
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if there is only one function', () => {
            [['aggregate', 'mean'], ['timeUnit', vegaTime.MONTH], ['bin', true], , ['autoCount', true]].forEach((tuple) => {
                let modifiedEncQ = util_1.duplicate(encQ);
                modifiedEncQ[tuple[0]] = tuple[1];
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return false if there are multiple functions', () => {
            [
                ['mean', vegaTime.MONTH, true],
                ['mean', undefined, true],
                ['mean', vegaTime.MONTH, undefined],
                [undefined, vegaTime.MONTH, true]
            ].forEach(tuple => {
                encQ.aggregate = tuple[0];
                encQ.timeUnit = tuple[1];
                encQ.bin = tuple[2];
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
    });
    describe('timeUnitAppliedForTemporal', () => {
        let encQ = {
            channel: CHANNEL.X,
            timeUnit: vegaTime.MONTH,
            field: 'A',
            type: undefined
        };
        it('should return false if timeUnit is applied to non-temporal type', () => {
            [TYPE.NOMINAL, TYPE.ORDINAL, TYPE.QUANTITATIVE].forEach(type => {
                encQ.type = type;
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
            });
        });
        it('should return true if aggregate is applied to quantitative field', () => {
            // TODO: verify if this really works with temporal
            encQ.type = TYPE.TEMPORAL;
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('scalePropertiesSupportedByScaleType', () => {
        it('should return true if scaleType is not specified.', () => {
            let encQ = {
                channel: '?',
                field: 'A',
                type: '?'
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if scaleType is still ambiguous.', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: '?',
                field: 'A',
                type: '?',
                scale: {}
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false if scale property is not supported by the scale type', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'nominal',
                scale: {
                    // type: point
                    clamp: true // clamp should not work with discreteDomain scale
                }
            };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if scale property is supported', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'quantitative',
                scale: {
                    type: 'linear',
                    round: true
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true if scale type is point and a property is supported by band', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'nominal',
                scale: {
                    // type: point
                    // paddingInner is actually a band scale property, but our scaleType doesn't distinguish point and band.
                    paddingInner: 20
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByScaleType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('scalePropertiesSupportedByChannel', () => {
        it('should return true when channel is a wildcard', () => {
            let encQ = {
                channel: '?',
                field: 'A',
                type: '?',
                scale: {
                    paddingInner: 20
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when scale property range with channel x', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'quantitative',
                scale: {
                    range: [0, 10]
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when scale property range with channel y', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'y',
                field: 'A',
                type: 'quantitative',
                scale: {
                    range: [0, 10]
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false when scale property range with channel row', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'row',
                field: 'A',
                type: 'quantitative',
                scale: {
                    range: [0, 10]
                }
            };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return false when scale property range with channel column', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'column',
                field: 'A',
                type: 'quantitative',
                scale: {
                    range: [0, 10]
                }
            };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when scale property range with channel x2', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x2',
                field: 'A',
                type: 'quantitative',
                scale: {
                    range: [0, 10]
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when scale property type with channel x with name, enum scale props', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'quantitative',
                scale: {
                    type: 'linear',
                    name: '?',
                    enum: wildcard_2.DEFAULT_ENUM_INDEX.scale
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when scale property padding with channel x', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'quantitative',
                scale: {
                    padding: 1.0
                }
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
        it('should return true when encoding query is missing scale prop', () => {
            let encQ = {
                // Scale type depends on channel, so this will make scale type ambiguous.
                channel: 'x',
                field: 'A',
                type: 'quantitative'
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['scalePropertiesSupportedByChannel'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), defaultOpt));
        });
    });
    describe('typeMatchesSchemaType', () => {
        let encQ = {
            channel: CHANNEL.X,
            field: 'O',
            type: undefined
        };
        it("should return false if type does not match schema's type", () => {
            [TYPE.TEMPORAL, TYPE.QUANTITATIVE, TYPE.NOMINAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it("should return true if string matches schema's type ", () => {
            [TYPE.ORDINAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it('should return false if field does not exist', () => {
            const invalidFieldEncQ = { channel: CHANNEL.X, field: 'random', type: TYPE.NOMINAL };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(invalidFieldEncQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
        });
        it('should return false if field="*" has non-quantitative type', () => {
            [TYPE.TEMPORAL, TYPE.ORDINAL, TYPE.NOMINAL].forEach(type => {
                const countEncQ = {
                    channel: CHANNEL.X,
                    aggregate: 'count',
                    field: '*',
                    type: type
                };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(countEncQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it('should return true if field="*" has quantitative type', () => {
            const countEncQ = {
                channel: CHANNEL.X,
                aggregate: 'count',
                field: '*',
                type: TYPE.QUANTITATIVE
            };
            chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(countEncQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
        });
    });
    describe('typeMatchesPrimitiveType', () => {
        let encQ = {
            channel: CHANNEL.X,
            field: 'O',
            type: undefined
        };
        it('should return false if string is used as quantitative or temporal', () => {
            [TYPE.TEMPORAL, TYPE.QUANTITATIVE].forEach(type => {
                encQ.type = type;
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it('should return true if string is used as ordinal or nominal ', () => {
            [TYPE.NOMINAL, TYPE.ORDINAL].forEach(type => {
                encQ.type = type;
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it('should return false if field does not exist', () => {
            const invalidFieldEncQ = { channel: CHANNEL.X, field: 'random', type: TYPE.NOMINAL };
            chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(invalidFieldEncQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
        });
        it('should return true if field="*" has non-quantitative type', () => {
            [TYPE.TEMPORAL, TYPE.ORDINAL, TYPE.NOMINAL, TYPE.QUANTITATIVE].forEach(type => {
                const countEncQ = {
                    channel: CHANNEL.X,
                    aggregate: 'count',
                    field: '*',
                    type: type
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(countEncQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
    });
    describe('stackIsOnlyUsedWithXY', () => {
        it('should return true for stack specified in X or Y channel', () => {
            [CHANNEL.X, CHANNEL.Y].forEach(_channel => {
                const encQ = {
                    channel: _channel,
                    stack: 'zero'
                };
                chai_1.assert.isTrue(field_1.FIELD_CONSTRAINT_INDEX['stackIsOnlyUsedWithXY'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
        it('should return false for stack specified in non X or Y channel', () => {
            const NON_XY_CHANNELS = util_1.without(channel_1.CHANNELS, [CHANNEL.X, CHANNEL.Y]);
            NON_XY_CHANNELS.forEach(_channel => {
                const encQ = {
                    channel: _channel,
                    stack: 'zero'
                };
                chai_1.assert.isFalse(field_1.FIELD_CONSTRAINT_INDEX['stackIsOnlyUsedWithXY'].satisfy(encQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
    });
});
//# sourceMappingURL=field.test.js.map