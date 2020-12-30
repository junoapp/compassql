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
exports.DIMENSION_PREFERENCE = exports.SET_FACET_PREFERENCE = exports.SET_AXIS_PREFERRENCE = exports.SET_3D = exports.SET_2D = exports.SET_1D = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const channel_1 = require("vega-lite/build/src/channel");
const mark_1 = require("vega-lite/build/src/mark");
const vegaTime = __importStar(require("vega-time"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../../../src/config");
const model_1 = require("../../../src/model");
const effectiveness_1 = require("../../../src/ranking/effectiveness");
const util_1 = require("../../../src/util");
const fixture_1 = require("../../fixture");
const rule_1 = require("../rule");
function build(specQ) {
    return model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
}
const POINTS = [mark_1.POINT, mark_1.SQUARE, mark_1.CIRCLE];
exports.SET_1D = {
    name: 'mark for plots with 1 field',
    rules: (function () {
        const rules = [];
        function plot1d(mark, channel, type) {
            return model_1.SpecQueryModel.build({
                mark: mark,
                encodings: [
                    {
                        channel: channel,
                        field: 'f',
                        type: type
                    }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
        }
        rules.push({
            name: 'N with varying mark',
            items: util_1.nestedMap([[mark_1.POINT /*, RECT */], mark_1.TICK, [mark_1.LINE, mark_1.BAR, mark_1.AREA], mark_1.RULE], mark => {
                return plot1d(mark, channel_1.X, TYPE.NOMINAL);
            })
        });
        function countplot(mark, field, type) {
            return model_1.SpecQueryModel.build({
                mark: mark,
                encodings: [
                    {
                        channel: channel_1.Y,
                        field: field,
                        type: type
                    },
                    {
                        channel: channel_1.X,
                        aggregate: 'count',
                        field: '*',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
        }
        rules.push({
            name: 'N plot with varying marks',
            items: util_1.nestedMap([mark_1.BAR, mark_1.POINT, mark_1.TICK, [mark_1.LINE, mark_1.AREA], mark_1.RULE], mark => {
                return countplot(mark, 'N', TYPE.NOMINAL);
            })
        });
        rules.push({
            name: 'O plot with varying marks',
            items: util_1.nestedMap([mark_1.BAR, mark_1.POINT, mark_1.TICK, [mark_1.LINE, mark_1.AREA], mark_1.RULE], mark => {
                return countplot(mark, 'O', TYPE.ORDINAL);
            })
        });
        rules.push({
            name: 'Q dot plot with varying mark',
            items: util_1.nestedMap([mark_1.TICK, mark_1.POINT, [mark_1.LINE, mark_1.BAR, mark_1.AREA], mark_1.RULE], mark => {
                return plot1d(mark, channel_1.X, TYPE.QUANTITATIVE);
            })
        });
        function histogram(mark, xEncQ) {
            return model_1.SpecQueryModel.build({
                mark: mark,
                encodings: [
                    xEncQ,
                    {
                        channel: channel_1.Y,
                        aggregate: 'count',
                        field: '*',
                        type: TYPE.QUANTITATIVE
                    }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
        }
        rules.push({
            name: 'Q histogram with varying marks',
            items: util_1.nestedMap([mark_1.BAR, mark_1.POINT, mark_1.TICK, [mark_1.LINE, mark_1.AREA], mark_1.RULE], mark => {
                return histogram(mark, {
                    channel: channel_1.X,
                    bin: true,
                    field: 'Q',
                    type: TYPE.QUANTITATIVE
                });
            })
        });
        rules.push({
            name: 'T dot plot with varying mark',
            items: util_1.nestedMap([mark_1.TICK, mark_1.POINT, [mark_1.LINE, mark_1.BAR, mark_1.AREA], mark_1.RULE], mark => {
                return plot1d(mark, channel_1.X, TYPE.TEMPORAL);
            })
        });
        rules.push({
            name: 'TimeUnit T count with varying marks',
            items: util_1.nestedMap([mark_1.LINE, mark_1.AREA, mark_1.BAR, mark_1.POINT, mark_1.TICK, mark_1.RULE], mark => {
                return histogram(mark, {
                    channel: channel_1.X,
                    timeUnit: vegaTime.MONTH,
                    field: 'T',
                    type: TYPE.TEMPORAL
                });
            })
        });
        return rules;
    })()
};
exports.SET_2D = {
    name: 'mark for plots with 2 fields',
    rules: (function () {
        const rules = [];
        rules.push({
            name: 'NxN',
            items: util_1.nestedMap([
                {
                    mark: mark_1.POINT,
                    encodings: [
                        { channel: channel_1.X, field: 'N', type: TYPE.NOMINAL },
                        { channel: channel_1.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: channel_1.SIZE, aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE }
                    ]
                },
                {
                    mark: mark_1.BAR,
                    encodings: [
                        { channel: channel_1.X, field: 'N', type: TYPE.NOMINAL },
                        { channel: channel_1.COLOR, field: 'N1', type: TYPE.NOMINAL },
                        { channel: channel_1.Y, aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE }
                    ]
                }
            ], specQ => model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG))
        });
        function stripplot(mark, qMixIns = {}) {
            return build({
                mark: mark,
                encodings: [
                    util_1.extend({ channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE }, qMixIns),
                    { channel: channel_1.Y, field: 'N', type: TYPE.NOMINAL }
                ]
            });
        }
        rules.push({
            name: 'NxQ Strip Plot',
            items: util_1.nestedMap([mark_1.TICK, POINTS], stripplot)
        });
        rules.push({
            name: 'NxA(Q) Strip Plot',
            items: util_1.nestedMap([mark_1.BAR, POINTS, mark_1.TICK, [mark_1.LINE, mark_1.AREA], mark_1.RULE], mark => stripplot(mark, { aggregate: 'mean' }))
        });
        // TODO: O
        // TODO: O x BIN(Q) x #
        return rules;
    })()
};
exports.SET_3D = {
    name: 'encoding for plots with 3 fields',
    rules: (function () {
        const rules = [];
        rules.push({
            name: 'Nx?(Q)x?(Q)',
            items: util_1.nestedMap([
                {
                    mark: mark_1.POINT,
                    encodings: [
                        { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.COLOR, field: 'N', type: TYPE.NOMINAL }
                    ]
                },
                [channel_1.ROW, channel_1.COLUMN].map(facet => {
                    return {
                        mark: mark_1.POINT,
                        encodings: [
                            { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE },
                            { channel: facet, field: 'N', type: TYPE.NOMINAL }
                        ]
                    };
                }),
                {
                    mark: mark_1.TICK,
                    encodings: [
                        { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.COLOR, field: 'Q1', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.Y, field: 'N', type: TYPE.NOMINAL }
                    ]
                },
                [channel_1.COLOR, channel_1.SIZE].map(_ => {
                    return {
                        mark: mark_1.POINT,
                        encodings: [
                            { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: channel_1.COLOR, field: 'Q1', type: TYPE.QUANTITATIVE },
                            { channel: channel_1.Y, field: 'N', type: TYPE.NOMINAL }
                        ]
                    };
                })
            ], specQ => model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG))
        });
        rules.push({
            name: 'Ox?(Q)x?(Q)',
            items: util_1.nestedMap([
                {
                    mark: mark_1.POINT,
                    encodings: [
                        { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.COLOR, field: 'O', type: TYPE.ORDINAL }
                    ]
                },
                [channel_1.ROW, channel_1.COLUMN].map(facet => {
                    return {
                        mark: mark_1.POINT,
                        encodings: [
                            { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE },
                            { channel: facet, field: 'O', type: TYPE.ORDINAL }
                        ]
                    };
                }),
                {
                    // TODO: consider x: Q, y:O, color:Q1 like above
                    mark: mark_1.POINT,
                    encodings: [
                        { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.SIZE, field: 'Q1', type: TYPE.QUANTITATIVE },
                        { channel: channel_1.Y, field: 'O', type: TYPE.ORDINAL }
                    ]
                }
            ], specQ => model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG))
        });
        return rules;
    })()
};
exports.SET_AXIS_PREFERRENCE = {
    name: 'Axis Preference',
    rules: (function () {
        const rules = [];
        function countplot(dimType, dimChannel, countChannel, dimMixins) {
            return build({
                mark: 'point',
                encodings: [
                    { channel: countChannel, aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE },
                    util_1.extend({ channel: dimChannel, field: 'N', type: dimType }, dimMixins)
                ]
            });
        }
        [mark_1.BAR, POINTS, mark_1.TICK, mark_1.LINE, mark_1.AREA].forEach(mark => {
            rules.push({
                name: `Nx# Count Plot (${mark})`,
                items: [countplot(TYPE.NOMINAL, channel_1.Y, channel_1.X), countplot(TYPE.NOMINAL, channel_1.X, channel_1.Y)]
            });
            rules.push({
                name: `Ox# Count Plot (${mark})`,
                items: [countplot(TYPE.ORDINAL, channel_1.Y, channel_1.X), countplot(TYPE.ORDINAL, channel_1.X, channel_1.Y)]
            });
            rules.push({
                name: `Tx# Count Plot (${mark})`,
                items: [countplot(TYPE.TEMPORAL, channel_1.X, channel_1.Y), countplot(TYPE.TEMPORAL, channel_1.Y, channel_1.X)]
            });
            rules.push({
                name: `BIN(Q)x# Count Plot (${mark})`,
                items: [countplot(TYPE.QUANTITATIVE, channel_1.X, channel_1.Y, { bin: true }), countplot(TYPE.QUANTITATIVE, channel_1.Y, channel_1.X, { bin: true })]
            });
        });
        return rules;
    })()
};
exports.SET_FACET_PREFERENCE = {
    name: 'Facet Preference',
    rules: (function () {
        const rules = [];
        function facetedPlot(_, facet) {
            return build({
                mark: 'point',
                encodings: [
                    { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE },
                    { channel: facet, field: 'N', type: TYPE.NOMINAL }
                ]
            });
        }
        POINTS.concat([mark_1.BAR, mark_1.TICK, mark_1.LINE, mark_1.AREA]).forEach((mark) => {
            rules.push({
                name: 'Row over column',
                items: [facetedPlot(mark, CHANNEL.ROW), facetedPlot(mark, CHANNEL.COLUMN)]
            });
        });
        return rules;
    })()
};
exports.DIMENSION_PREFERENCE = {
    name: 'Dimension Preference',
    rules: (function () {
        const rules = [];
        function facetedPlot(mark, dim) {
            return build({
                mark: mark,
                encodings: [
                    { channel: channel_1.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean' },
                    { channel: channel_1.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean' },
                    { channel: dim, field: 'N', type: TYPE.NOMINAL }
                ]
            });
        }
        POINTS.concat([mark_1.BAR, mark_1.TICK, mark_1.LINE, mark_1.AREA]).forEach(mark => {
            rules.push({
                name: 'Row over column',
                items: util_1.nestedMap([[channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY, channel_1.SHAPE], [channel_1.ROW, channel_1.COLUMN]], (dim) => {
                    return facetedPlot(mark, dim);
                })
            });
        });
        return rules;
    })()
};
function getScore(specM) {
    const featureScores = effectiveness_1.effectiveness(specM, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
    return featureScores.features.reduce((s, featureScore) => {
        return s + featureScore.score;
    }, 0);
}
describe('effectiveness', () => {
    describe(exports.SET_1D.name, () => {
        rule_1.testRuleSet(exports.SET_1D, getScore, (specM) => specM.toShorthand());
    });
    describe(exports.SET_2D.name, () => {
        rule_1.testRuleSet(exports.SET_2D, getScore, (specM) => specM.toShorthand());
    });
    describe(exports.SET_3D.name, () => {
        rule_1.testRuleSet(exports.SET_3D, getScore, (specM) => specM.toShorthand());
    });
    describe(exports.SET_AXIS_PREFERRENCE.name, () => {
        rule_1.testRuleSet(exports.SET_AXIS_PREFERRENCE, getScore, (specM) => specM.toShorthand());
    });
    describe(exports.SET_FACET_PREFERENCE.name, () => {
        rule_1.testRuleSet(exports.SET_FACET_PREFERENCE, getScore, (specM) => specM.toShorthand());
    });
});
//# sourceMappingURL=effectiveness.test.js.map