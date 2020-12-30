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
const generate_1 = require("../src/generate");
const encoding_1 = require("../src/query/encoding");
const util_1 = require("../src/util");
const wildcard_1 = require("../src/wildcard");
const fixture_1 = require("./fixture");
const CONFIG_WITH_AUTO_ADD_COUNT = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { autoAddCount: true });
describe('generate', function () {
    describe('1D', () => {
        describe('Q with mark=?, channel=size', () => {
            it('should enumerate mark=point and generate a point plot', () => {
                const specQ = {
                    mark: '?',
                    encodings: [
                        {
                            channel: CHANNEL.SIZE,
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getMark(), MARK.POINT);
            });
        });
        describe('Q with mark=point, channel=?', () => {
            it('should only enumerate channel x and y', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: '?',
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema);
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
            });
            it('should only enumerate channel x and channel y even if omitNonPositionalOrFacetOverPositionalChannels turned off', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: '?',
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitNonPositionalOrFacetOverPositionalChannels: false }));
                chai_1.assert.equal(answerSet.length, 2);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
            });
        });
        describe('Q with mark=?, channel=column, bin', () => {
            it('should generate point marks', () => {
                const specQ = {
                    mark: '?',
                    encodings: [
                        {
                            channel: CHANNEL.COLUMN,
                            field: 'A',
                            type: TYPE.QUANTITATIVE,
                            bin: {}
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getMark(), MARK.POINT);
            });
        });
        describe('Q with mark=?, channel=?', () => {
            it('should enumerate tick or point mark with x or y channel', () => {
                const specQ = {
                    mark: '?',
                    encodings: [
                        {
                            channel: '?',
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitNonPositionalOrFacetOverPositionalChannels: false }));
                chai_1.assert.equal(answerSet.length, 4);
                chai_1.assert.equal(answerSet[0].getMark(), MARK.POINT);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                chai_1.assert.equal(answerSet[1].getMark(), MARK.TICK);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.X);
                chai_1.assert.equal(answerSet[2].getMark(), MARK.POINT);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
                chai_1.assert.equal(answerSet[3].getMark(), MARK.TICK);
                chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
            });
        });
        describe('Q with aggregate=?, bin=?', () => {
            it('should enumerate raw, bin, aggregate', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
                chai_1.assert.equal(answerSet.length, 3);
            });
        });
    });
    describe('1D raw', () => {
        describe('dotplot', () => {
            it('should generate only a raw dot plot if omitAggregate is enabled.', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            aggregate: { name: 'aggregate', enum: [undefined, 'mean'] },
                            channel: CHANNEL.X,
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const CONFIG_WITH_OMIT_AGGREGATE = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitAggregate: true });
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_OMIT_AGGREGATE);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).aggregate, undefined);
            });
        });
    });
    describe('1D aggregate', () => {
        describe('dotplot with mean + histogram', () => {
            it('should generate only an aggregate dot plot if omitRaw is enabled.', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            aggregate: { name: 'aggregate', enum: [undefined, 'mean'] },
                            channel: CHANNEL.X,
                            field: 'A',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const CONFIG_WITH_OMIT_RAW = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitRaw: true });
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_OMIT_RAW);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).aggregate, 'mean');
            });
        });
    });
    describe('2D', () => {
        describe('x:N,y:N', () => {
            const specQ = {
                mark: wildcard_1.SHORT_WILDCARD,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        field: 'N',
                        type: TYPE.NOMINAL
                    },
                    {
                        channel: CHANNEL.Y,
                        field: 'N20',
                        type: TYPE.NOMINAL
                    }
                ],
                config: CONFIG_WITH_AUTO_ADD_COUNT
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
            it('should return counted heatmaps', () => {
                chai_1.assert.isTrue(answerSet.length > 0);
                answerSet.forEach(specM => {
                    chai_1.assert.isTrue(util_1.some(specM.getEncodings(), encQ => {
                        return encoding_1.isAutoCountQuery(encQ) && encQ.autoCount === true;
                    }));
                });
            });
            it('should not use tick, bar, line, area, or rect', () => {
                answerSet.forEach(specM => {
                    chai_1.assert.notEqual(specM.getMark(), MARK.AREA);
                    chai_1.assert.notEqual(specM.getMark(), MARK.LINE);
                    chai_1.assert.notEqual(specM.getMark(), MARK.BAR);
                    chai_1.assert.notEqual(specM.getMark(), MARK.TICK);
                });
            });
        });
        describe('NxO', () => {
            const specQ = {
                mark: '?',
                encodings: [
                    { channel: CHANNEL.Y, field: 'O', type: TYPE.ORDINAL },
                    { field: 'N', type: TYPE.NOMINAL, channel: '?' }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            it('should generate a rect table with x and y as dimensions with autocount turned off', () => {
                answerSet.forEach(specM => {
                    chai_1.assert.isTrue(specM.getEncodingQueryByChannel(CHANNEL.X).type === TYPE.NOMINAL &&
                        specM.getEncodingQueryByChannel(CHANNEL.Y).type === TYPE.ORDINAL);
                });
            });
        });
        describe('QxQ', () => {
            it('should not return any of bar, tick, line, or area', () => {
                const specQ = {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
                answerSet.forEach(specM => {
                    chai_1.assert.notEqual(specM.getMark(), MARK.AREA);
                    chai_1.assert.notEqual(specM.getMark(), MARK.LINE);
                    chai_1.assert.notEqual(specM.getMark(), MARK.BAR);
                    chai_1.assert.notEqual(specM.getMark(), MARK.TICK);
                });
            });
        });
        describe('A(Q) x A(Q)', () => {
            it('should return neither line nor area', () => {
                const specQ = {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: 'mean',
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            aggregate: 'mean',
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
                answerSet.forEach(specM => {
                    chai_1.assert.notEqual(specM.getMark(), MARK.AREA);
                    chai_1.assert.notEqual(specM.getMark(), MARK.LINE);
                });
            });
        });
    });
    describe('3D', () => {
        describe('NxNxQ', () => {
            const specQ = {
                mark: wildcard_1.SHORT_WILDCARD,
                encodings: [
                    {
                        channel: wildcard_1.SHORT_WILDCARD,
                        field: 'N',
                        type: TYPE.NOMINAL
                    },
                    {
                        channel: wildcard_1.SHORT_WILDCARD,
                        field: 'N20',
                        type: TYPE.NOMINAL
                    },
                    {
                        channel: wildcard_1.SHORT_WILDCARD,
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
            it('should not generate a plot with both x and y as dimensions with auto add count enabled', () => {
                answerSet.forEach(specM => {
                    chai_1.assert.isFalse(specM.getEncodingQueryByChannel(CHANNEL.X).type === TYPE.NOMINAL &&
                        specM.getEncodingQueryByChannel(CHANNEL.Y).type === TYPE.NOMINAL);
                });
            });
        });
        describe('NxNxQ with x = N1 and y = N2', () => {
            const specQ = {
                mark: wildcard_1.SHORT_WILDCARD,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        field: 'N',
                        type: TYPE.NOMINAL
                    },
                    {
                        channel: CHANNEL.Y,
                        field: 'N20',
                        type: TYPE.NOMINAL
                    },
                    {
                        channel: wildcard_1.SHORT_WILDCARD,
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
            it('should generate a rect heatmap with color encoding the quantitative measure', () => {
                answerSet.forEach(specM => {
                    chai_1.assert.isTrue(specM.getMark() === MARK.RECT &&
                        specM.getEncodingQueryByChannel(CHANNEL.COLOR).type === TYPE.QUANTITATIVE);
                });
            });
        });
    });
    describe('axis-zindex', () => {
        it('should enumerate default axisLayers', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        field: 'Q',
                        type: TYPE.QUANTITATIVE,
                        axis: { zindex: wildcard_1.SHORT_WILDCARD }
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).axis.zindex, 1);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).axis.zindex, 0);
        });
    });
    describe('scale-rangeStep', () => {
        it('should enumerate correct scaleType with width step', () => {
            const specQ = {
                width: { step: 10 },
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            type: { enum: [undefined, scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.POINT] }
                        },
                        field: 'Q',
                        type: TYPE.NOMINAL
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POINT);
        });
    });
    describe('scale-exponent', () => {
        it('should enumerate correct scale type when scale clamp is used with scale exponent and TYPE.Quantitative', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            clamp: true,
                            exponent: 1,
                            type: {
                                enum: [
                                    undefined,
                                    scale_1.ScaleType.LINEAR,
                                    scale_1.ScaleType.LOG,
                                    scale_1.ScaleType.POINT,
                                    scale_1.ScaleType.POW,
                                    scale_1.ScaleType.SQRT,
                                    // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                                    scale_1.ScaleType.TIME,
                                    scale_1.ScaleType.UTC
                                ]
                            }
                        },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 1);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POW);
        });
    });
    describe('scale-nice', () => {
        it('should enumerate correct scale type when scale nice is used with scale round and TYPE.QUANTITATIVE', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            nice: true,
                            round: true,
                            type: {
                                enum: [
                                    undefined,
                                    scale_1.ScaleType.LINEAR,
                                    scale_1.ScaleType.LOG,
                                    scale_1.ScaleType.POINT,
                                    scale_1.ScaleType.POW,
                                    scale_1.ScaleType.SQRT,
                                    // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                                    scale_1.ScaleType.TIME,
                                    scale_1.ScaleType.UTC
                                ]
                            }
                        },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 5);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LINEAR);
            chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LOG);
            chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POW);
            chai_1.assert.equal(answerSet[4].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.SQRT);
        });
    });
    describe('scale-zero', () => {
        it('should enumerate correct scale type when scale zero is used without bar mark or binning', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            zero: true,
                            type: { enum: [undefined, scale_1.ScaleType.SQRT, scale_1.ScaleType.LOG, scale_1.ScaleType.POINT, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC] }
                        },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.SQRT);
        });
        it('should enumerate correct scale properties with mark bar', () => {
            const specQ = {
                mark: MARK.BAR,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            zero: true,
                            type: { enum: [undefined, scale_1.ScaleType.SQRT, scale_1.ScaleType.LOG, scale_1.ScaleType.POINT, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC] }
                        },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.SQRT);
        });
    });
    describe('scale-type', () => {
        it('should enumerate correct scale enabling and scale type for quantitative field', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: {
                            enum: [true, false],
                            type: { enum: [undefined, scale_1.ScaleType.LOG, scale_1.ScaleType.UTC] }
                        },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 3);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LOG);
            chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).scale, false);
        });
        it('should enumerate correct scale type for quantitative field', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: { type: { enum: [undefined, scale_1.ScaleType.LOG, scale_1.ScaleType.UTC] } },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.LOG);
        });
        it('should enumerate correct scale type for temporal field without timeunit', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: { type: { enum: [scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.POINT, undefined, scale_1.ScaleType.LOG] } },
                        field: 'T',
                        type: TYPE.TEMPORAL
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 3);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.TIME);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.UTC);
            chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).scale.type, undefined);
        });
        it('should enumerate correct scale type for temporal field with timeunit', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: { type: { enum: [scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.POINT, undefined, scale_1.ScaleType.LOG] } },
                        field: 'T',
                        type: TYPE.TEMPORAL,
                        timeUnit: vegaTime.MINUTES
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 4);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.TIME);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.UTC);
            chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POINT);
            chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).scale.type, undefined);
        });
        it('should enumerate correct scale type for ordinal field with timeunit', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: { type: { enum: [scale_1.ScaleType.POINT, undefined, scale_1.ScaleType.LOG] } },
                        field: 'O',
                        type: TYPE.ORDINAL,
                        timeUnit: vegaTime.MINUTES
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POINT);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, undefined);
        });
        it('should enumerate correct scale type for ordinal field', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: 'x',
                        scale: { type: { enum: [scale_1.ScaleType.POINT, undefined, scale_1.ScaleType.LOG] } },
                        field: 'O',
                        type: TYPE.ORDINAL
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 2);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, scale_1.ScaleType.POINT);
            chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).scale.type, undefined);
        });
        it('should enumerate correct scale type for nominal field', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        scale: { type: { enum: [undefined, scale_1.ScaleType.LOG] } },
                        field: 'N',
                        type: TYPE.NOMINAL
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema);
            chai_1.assert.equal(answerSet.length, 1);
            chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.type, undefined);
        });
    });
    describe('bin-maxbins', () => {
        describe('Qx#', () => {
            it('should enumerate multiple maxbins parameter', () => {
                const specQ = {
                    mark: MARK.BAR,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: { maxbins: { enum: [10, 20, 30] } },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema);
                chai_1.assert.equal(answerSet.length, 3);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
            });
            it('should support enumerating both bin enabling and maxbins parameter', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: {
                                enum: [true, false],
                                maxbins: { enum: [10, 20, 30] }
                            },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema);
                chai_1.assert.equal(answerSet.length, 4);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
                chai_1.assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
                chai_1.assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
                chai_1.assert.equal(answerSet[3].getEncodingQueryByIndex(0).bin, false);
            });
        });
    });
    describe('autoAddCount', () => {
        describe('ordinal only', () => {
            it('should output autoCount in the answer set', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [{ channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL }]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
                chai_1.assert.equal(answerSet.length, 1);
                chai_1.assert.isTrue(answerSet[0].getEncodings()[1].autoCount);
            });
        });
        describe('non-binned quantitative only', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE }]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
            it('should output autoCount=false', () => {
                chai_1.assert.isFalse(answerSet[0].getEncodingQueryByIndex(1).autoCount);
            });
            it('should not output duplicate results in the answer set', () => {
                chai_1.assert.equal(answerSet.length, 1);
            });
        });
        describe('enumerate channel for a non-binned quantitative field', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: { enum: [CHANNEL.X, CHANNEL.SIZE, CHANNEL.COLOR] },
                        field: 'Q',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITH_AUTO_ADD_COUNT);
            it('should not output point with only size for color', () => {
                answerSet.forEach(model => {
                    model.getEncodings().forEach(encQ => {
                        chai_1.assert.notEqual(encQ.channel, CHANNEL.COLOR);
                        chai_1.assert.notEqual(encQ.channel, CHANNEL.SIZE);
                    });
                });
            });
        });
    });
    describe('stylizer', () => {
        it('should generate answerSet when all stylizers are turned off', () => {
            const specQ = {
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        field: 'A',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            };
            const CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { nominalColorScaleForHighCardinality: null }, { smallRangeStepForHighCardinalityOrFacet: null });
            const answerSet = generate_1.generate(specQ, fixture_1.schema, CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET);
            chai_1.assert.equal(answerSet.length, 1);
        });
        describe('nominalColorScaleForHighCardinality', () => {
            it('should output range = category20', () => {
                const specQ = {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.COLOR,
                            field: 'N20',
                            scale: {},
                            type: TYPE.NOMINAL
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.equal(answerSet[0].getEncodingQueryByIndex(0).scale.scheme, 'category20');
            });
        });
        describe('smallRangeStepForHighCardinalityOrFacet', () => {
            it('should output height step = 12', () => {
                const specQ = {
                    mark: MARK.BAR,
                    encodings: [
                        {
                            channel: CHANNEL.Y,
                            field: 'O_100',
                            scale: {},
                            type: TYPE.ORDINAL
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.equal(answerSet[0].specQuery.height.step, 12);
            });
            it('should output height step = 12', () => {
                const specQ = {
                    mark: MARK.BAR,
                    encodings: [
                        {
                            channel: CHANNEL.Y,
                            field: 'A',
                            scale: {},
                            type: TYPE.ORDINAL
                        },
                        {
                            channel: CHANNEL.ROW,
                            field: 'A',
                            type: TYPE.ORDINAL
                        }
                    ]
                };
                const answerSet = generate_1.generate(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.equal(answerSet[0].specQuery.height.step, 12);
            });
        });
    });
});
//# sourceMappingURL=generate.test.js.map