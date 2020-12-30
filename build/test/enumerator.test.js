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
const MARK = __importStar(require("vega-lite/build/src/mark"));
const scale_1 = require("vega-lite/build/src/scale");
const vegaTime = __importStar(require("vega-time"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../src/config");
const enumerator_1 = require("../src/enumerator");
const model_1 = require("../src/model");
const property_1 = require("../src/property");
const util_1 = require("../src/util");
const fixture_1 = require("./fixture");
function buildSpecQueryModel(specQ) {
    return model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
}
describe('enumerator', () => {
    describe('mark', () => {
        it('should correctly enumerate marks', () => {
            const specM = buildSpecQueryModel({
                mark: { enum: [MARK.POINT, MARK.TICK] },
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: 'O', type: TYPE.ORDINAL }
                ]
            });
            const enumerator = enumerator_1.getEnumerator(property_1.Property.MARK)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            const answerSet = enumerator([], specM);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getMark(), MARK.POINT);
            chai_1.assert.equal(answerSet[1].getMark(), MARK.TICK);
        });
        it('should not enumerate invalid mark', () => {
            const specM = buildSpecQueryModel({
                mark: { enum: [MARK.POINT, MARK.BAR, MARK.LINE, MARK.AREA] },
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.SHAPE, field: 'O', type: TYPE.ORDINAL }
                ]
            });
            const enumerator = enumerator_1.getEnumerator(property_1.Property.MARK)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            const answerSet = enumerator([], specM);
            chai_1.assert.equal(answerSet.length, 1);
            chai_1.assert.equal(answerSet[0].getMark(), MARK.POINT);
        });
    });
    describe('encoding', () => {
        describe('channel', () => {
            it('should correctly enumerate channels', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitVerticalDotPlot: false });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.CHANNEL)(specM.wildcardIndex, fixture_1.schema, opt);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
            });
            it('should not enumerate invalid channels', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.BAR,
                    encodings: [
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.SHAPE] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.CHANNEL)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                // Shape should be excluded since it does not work with bar.
            });
        });
        describe('aggregate', () => {
            it('should correctly enumerate aggregate', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: { enum: ['mean', 'median', undefined] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.AGGREGATE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).aggregate, 'mean');
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).aggregate, 'median');
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).aggregate, undefined);
            });
            it('should not enumerate aggregate when type is nominal', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: { enum: ['mean', 'median', undefined] },
                            field: 'N',
                            type: TYPE.NOMINAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.AGGREGATE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).aggregate, undefined);
            });
        });
        describe('bin', () => {
            it('should correctly enumerate bin with nested property', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: {
                                enum: [true, false],
                                maxbins: 10
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.BIN)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin.maxbins, 10);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin, false);
            });
            it('should correctly enumerate bin without nested property', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: {
                                enum: [true, false]
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.BIN)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).bin, {});
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin, false);
            });
        });
        describe('maxbin', () => {
            it('should correctly enumerate maxbins', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.BAR,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: {
                                maxbins: { enum: [5, 10, 20] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'bin', child: 'maxbins' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin.maxbins, 5);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin.maxbins, 10);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin.maxbins, 20);
            });
        });
        describe('scale', () => {
            it('should correctly enumerate scale with nested property', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                enum: [true, false],
                                type: scale_1.ScaleType.LOG
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.SCALE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LOG);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale, false);
            });
            it('should correctly enumerate scale without nested property', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                enum: [true, false]
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.SCALE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale, false);
            });
        });
        describe('scaleClamp', () => {
            it('should correctly enumerate scaleClamp', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                clamp: { enum: [true, false, undefined] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'clamp' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.clamp, true);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.clamp, false);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.clamp, undefined);
            });
        });
        describe('scaleDomain', () => {
            it('should correctly enumerate scaleDomain with string[] values', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                domain: { enum: [undefined, ['cats', 'dogs'], ['chickens', 'pigs']] }
                            },
                            field: 'N',
                            type: TYPE.NOMINAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'domain' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.domain, undefined);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.domain, [
                    'cats',
                    'dogs'
                ]);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.domain, [
                    'chickens',
                    'pigs'
                ]);
            });
            it('should correctly enumerate scaleDomain with number[] values', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                domain: { enum: [undefined, [1, 3], [5, 7]] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'domain' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.domain, undefined);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.domain, [1, 3]);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.domain, [5, 7]);
            });
        });
        describe('scaleBase', () => {
            it('should correctly enumerate scaleBase', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                base: { enum: [0.5, 1, 2, undefined] },
                                type: scale_1.ScaleType.LOG
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'base' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 4);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.base, 0.5);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.base, 1);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.base, 2);
                chai_1.assert.deepEqual(answerSet[3].getEncodingQueryByIndex(0).scale.base, undefined);
            });
        });
        describe('scaleNice', () => {
            it('should correctly enumerate scaleNice', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                nice: { enum: [undefined, true, false] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'nice' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
            });
        });
        describe('scaleRange', () => {
            it('should correctly enumerate scaleRange with string[] values', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.COLOR,
                            scale: {
                                range: { enum: [undefined, ['red', 'blue'], ['green', 'black']] }
                            },
                            field: 'N',
                            type: TYPE.NOMINAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'range' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.range, undefined);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.range, [
                    'red',
                    'blue'
                ]);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.range, [
                    'green',
                    'black'
                ]);
            });
            it('should correctly enumerate scaleRange with number[] values', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.SIZE,
                            scale: {
                                range: { enum: [undefined, [1, 3], [5, 7]] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'range' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.range, undefined);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.range, [1, 3]);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.range, [5, 7]);
            });
        });
        describe('scaleRound', () => {
            it('should correctly enumerate scaleRound', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                round: { enum: [true, false, undefined] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'round' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.round, true);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.round, false);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.round, undefined);
            });
        });
        describe('scaleType', () => {
            it('should correctly enumerate scaleType', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            scale: {
                                type: { enum: [undefined, scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.POINT] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator({ parent: 'scale', child: 'type' })(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.deepEqual(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
                chai_1.assert.deepEqual(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LOG);
                chai_1.assert.deepEqual(answerSet[2].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POW);
            });
        });
        describe('timeUnit', () => {
            it('should correctly enumerate timeUnits', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'T',
                            timeUnit: { enum: [vegaTime.MONTH, vegaTime.DAY, vegaTime.YEAR, undefined] },
                            type: TYPE.TEMPORAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TIMEUNIT)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 4);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).timeUnit, vegaTime.MONTH);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).timeUnit, vegaTime.DAY);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).timeUnit, vegaTime.YEAR);
                chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).timeUnit, undefined);
            });
            it('should not enumerate timeUnit with non-temporal field', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            timeUnit: { enum: [vegaTime.MONTH, vegaTime.DAY, vegaTime.YEAR, undefined] },
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TIMEUNIT)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).timeUnit, undefined);
            });
        });
        describe('field', () => {
            it('should correctly enumerate fields with quantitative type', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: { enum: ['Q', 'Q1', 'Q2', 'O', 'N', 'T'] },
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.FIELD)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'Q');
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).field, 'Q1');
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).field, 'Q2');
            });
            it('should correctly enumerate fields with temporal type', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: { enum: ['T', 'Q', 'O', 'N'] },
                            type: TYPE.TEMPORAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.FIELD)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'T');
            });
            it('should correctly enumerate fields with ordinal type', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: { enum: ['O', 'O_10', 'O_20', 'O_100', 'Q', 'T', 'N'] },
                            type: TYPE.ORDINAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.FIELD)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 4);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'O');
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).field, 'O_10');
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).field, 'O_20');
                chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).field, 'O_100');
            });
            it('should correctly enumerate fields with nominal type', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: { enum: ['N', 'N20', 'Q', 'O', 'T'] },
                            type: TYPE.NOMINAL
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.FIELD)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'N');
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).field, 'N20');
            });
        });
        describe('type', () => {
            it('should correctly enumerate numeric field with typeMatchesSchemaType config turned off', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: { enum: [TYPE.QUANTITATIVE, TYPE.NOMINAL, TYPE.ORDINAL, TYPE.TEMPORAL] }
                        }
                    ]
                });
                const noTypeMatchesSchema = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { typeMatchesSchemaType: false });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TYPE)(specM.wildcardIndex, fixture_1.schema, noTypeMatchesSchema);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, TYPE.QUANTITATIVE);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).type, TYPE.NOMINAL);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).type, TYPE.ORDINAL);
            });
            it('should correctly enumerate numeric field with typeMatchesSchemaType turned on', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: { enum: [TYPE.QUANTITATIVE, TYPE.NOMINAL, TYPE.ORDINAL, TYPE.TEMPORAL] }
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TYPE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, TYPE.QUANTITATIVE);
            });
            it('should correctly enumerate ordinal types', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'O',
                            type: { enum: [TYPE.ORDINAL, TYPE.TEMPORAL, TYPE.QUANTITATIVE, TYPE.NOMINAL] }
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TYPE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, TYPE.ORDINAL);
            });
            it('should correctly enumerate temporal types', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'T',
                            type: { enum: [TYPE.TEMPORAL, TYPE.ORDINAL, TYPE.QUANTITATIVE, TYPE.NOMINAL] }
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TYPE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, TYPE.TEMPORAL);
            });
            it('should correctly enumerate nominal types', () => {
                const specM = buildSpecQueryModel({
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'N',
                            type: { enum: [TYPE.NOMINAL, TYPE.TEMPORAL, TYPE.QUANTITATIVE, TYPE.ORDINAL] }
                        }
                    ]
                });
                const enumerator = enumerator_1.getEnumerator(property_1.Property.TYPE)(specM.wildcardIndex, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const answerSet = enumerator([], specM);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, TYPE.NOMINAL);
            });
        });
    });
});
//# sourceMappingURL=enumerator.test.js.map