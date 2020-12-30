"use strict";
/* tslint:disable:quotemark */
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
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../src/config");
const property_1 = require("../src/property");
const ranking_1 = require("../src/ranking/ranking");
const recommend_1 = require("../src/recommend");
const result_1 = require("../src/result");
const util_1 = require("../src/util");
const wildcard_1 = require("../src/wildcard");
const fixture_1 = require("./fixture");
describe('recommend()', () => {
    it('recommends line for a histogram of a temporal field', () => {
        const group = recommend_1.recommend({
            spec: {
                data: { url: 'data/cars.json' },
                transform: [],
                mark: '?',
                encodings: [
                    {
                        channel: 'x',
                        timeUnit: 'year',
                        field: 'T1',
                        type: 'temporal'
                    },
                    {
                        channel: 'y',
                        field: '*',
                        type: 'quantitative',
                        aggregate: 'count'
                    }
                ],
                config: {
                    // "overlay": {"line": true},
                    scale: { useUnaggregatedDomain: true }
                }
            },
            groupBy: 'encoding',
            orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
            chooseBy: ['aggregationQuality', 'effectiveness'],
            config: { autoAddCount: false }
        }, fixture_1.schema);
        chai_1.assert.equal(result_1.getTopResultTreeItem(group.result).getMark(), 'line');
    });
    it('recommends bar chart given 1 nominal field and specifying value for size channel', () => {
        const group = recommend_1.recommend({
            spec: {
                data: { url: 'data/cars.json' },
                mark: '?',
                encodings: [{ channel: '?', field: 'Origin', type: 'nominal' }, { channel: 'size', value: 52 }]
            },
            nest: [
                {
                    groupBy: ['field', 'aggregate', 'bin', 'timeUnit', 'stack'],
                    orderGroupBy: 'aggregationQuality'
                },
                {
                    groupBy: [
                        {
                            property: 'channel',
                            replace: {
                                x: 'xy',
                                y: 'xy',
                                color: 'style',
                                size: 'style',
                                shape: 'style',
                                opacity: 'style',
                                row: 'facet',
                                column: 'facet'
                            }
                        }
                    ],
                    orderGroupBy: 'effectiveness'
                },
                { groupBy: ['channel'], orderGroupBy: 'effectiveness' }
            ],
            orderBy: 'effectiveness',
            config: { autoAddCount: true }
        }, fixture_1.schema);
        chai_1.assert.equal(result_1.getTopResultTreeItem(group.result).getMark(), 'bar');
    });
    it('recommends bar for a histogram of a temporal field', () => {
        const group = recommend_1.recommend({
            spec: {
                data: { url: 'data/cars.json' },
                transform: [],
                mark: '?',
                encodings: [
                    {
                        channel: 'x',
                        bin: true,
                        field: 'Q1',
                        type: 'temporal',
                        timeUnit: 'quarter'
                    }
                ]
            },
            groupBy: 'encoding',
            orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
            chooseBy: ['aggregationQuality', 'effectiveness'],
            config: { autoAddCount: true }
        }, fixture_1.schema);
        chai_1.assert.equal(result_1.getTopResultTreeItem(group.result).getMark(), 'bar');
    });
    it('recommends bar for a histogram of a temporal field', () => {
        const group = recommend_1.recommend({
            spec: {
                data: { url: 'data/movies.json' },
                transform: [],
                mark: '?',
                encodings: [
                    {
                        channel: 'y',
                        field: 'title',
                        type: 'key'
                    }
                ]
            },
            groupBy: 'encoding',
            orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
            chooseBy: ['aggregationQuality', 'effectiveness'],
            config: { autoAddCount: true }
        }, fixture_1.schema);
        chai_1.assert.equal(result_1.getTopResultTreeItem(group.result).getMark(), 'bar');
    });
    describe('omitAggregatePlotWithoutDimension', () => {
        it('?(Q) x ?(Q) should not produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is enabled.', () => {
            const q = {
                spec: {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [property_1.Property.FIELD, property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT]
                    }
                ],
                config: {
                    autoAddCount: true,
                    omitAggregatePlotWithoutDimension: true
                }
            };
            const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = Object.assign(Object.assign({}, config_1.DEFAULT_QUERY_CONFIG), { omitAggregatePlotWithoutDimension: true });
            const result = recommend_1.recommend(q, fixture_1.schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
            chai_1.assert.equal(result.items.length, 6);
        });
        it('?(Q) x ?(Q) should produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is disabled.', () => {
            const q = {
                spec: {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [property_1.Property.FIELD, property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT]
                    }
                ],
                config: {
                    autoAddCount: true,
                    omitAggregatePlotWithoutDimension: false
                }
            };
            const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = Object.assign(Object.assign({}, config_1.DEFAULT_QUERY_CONFIG), { omitAggregatePlotWithoutDimension: false });
            const result = recommend_1.recommend(q, fixture_1.schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
            chai_1.assert.equal(result.items.length, 7);
        });
    });
    describe('nested query', () => {
        const q = {
            spec: {
                mark: '?',
                encodings: [{ channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE }]
            },
            nest: [{ groupBy: 'fieldTransform' }],
            orderBy: 'effectiveness'
        };
        const qCopy = util_1.duplicate(q);
        const output = recommend_1.recommend(q, fixture_1.schema);
        const result = output.result;
        it('enumerates a nested query correctly ', () => {
            chai_1.assert.isTrue(result_1.isResultTree(result.items[0]));
            if (result_1.isResultTree(result.items[0])) {
                const group1 = result.items[0];
                chai_1.assert.isFalse(result_1.isResultTree(group1.items[0]));
                chai_1.assert.equal(group1.items.length, 2);
                chai_1.assert.equal(group1.items[0].specQuery.mark, 'tick');
                chai_1.assert.equal(group1.items[1].specQuery.mark, 'point');
            }
        });
        it('should augment wildcard name for wildcards', () => {
            chai_1.assert.isDefined(output.query.spec.mark.name);
        });
        it('should not cause side effect to the original query object.', () => {
            chai_1.assert.deepEqual(q, qCopy);
        });
    });
    describe('rank', () => {
        it("should sort SpecQueryModelGroup's items when passed orderBy is an array", () => {
            const q = {
                spec: {
                    mark: '?',
                    encodings: [
                        { channel: '?', bin: '?', aggregate: '?', field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: '?', bin: '?', aggregate: '?', field: 'Q1', type: TYPE.QUANTITATIVE }
                    ]
                },
                orderBy: ['aggregationQuality', 'effectiveness']
            };
            const output = recommend_1.recommend(q, fixture_1.schema);
            const result = output.result;
            function score(item, rankingName) {
                return ranking_1.getScore(item, rankingName, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            }
            for (let i = 1; i < result.items.length; i++) {
                let prev = result.items[i - 1];
                let cur = result.items[i];
                chai_1.assert.isTrue(score(prev, 'aggregationQuality') >= score(cur, 'aggregationQuality') ||
                    (score(prev, 'aggregationQuality') === score(cur, 'aggregationQuality') &&
                        score(prev, 'effectiveness') >= score(cur, 'effectiveness')));
            }
        });
    });
    it('enumerates a flat query correctly ', () => {
        const q = {
            spec: {
                mark: '?',
                encodings: [{ channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE }]
            },
            orderBy: 'effectiveness'
        };
        const result = recommend_1.recommend(q, fixture_1.schema).result;
        chai_1.assert.isFalse(result_1.isResultTree(result.items[0]));
        chai_1.assert.equal(result.items.length, 2);
        chai_1.assert.equal(result.items[0].specQuery.mark, 'tick');
        chai_1.assert.equal(result.items[1].specQuery.mark, 'point');
    });
});
//# sourceMappingURL=recommend.test.js.map