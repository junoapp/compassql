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
const vegaTime = __importStar(require("vega-time"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../../src/config");
const model_1 = require("../../src/model");
const ranking_1 = require("../../src/ranking/ranking");
const fixture_1 = require("../fixture");
describe('ranking', () => {
    describe('rank', () => {
        it('should return an empty group if the input group is empty', () => {
            let group = ranking_1.rank({
                name: '',
                path: '',
                items: []
            }, {
                spec: {
                    mark: MARK.BAR,
                    encodings: [{ channel: CHANNEL.SHAPE, field: 'N', type: TYPE.NOMINAL }]
                },
                chooseBy: 'effectiveness'
            }, fixture_1.schema, 0);
            chai_1.assert.deepEqual(group.items, []);
        });
    });
    describe('comparatorFactory', () => {
        describe('nested / multiple ranking', () => {
            it('should create a comparator that uses the second ranker of an orderBy array to specs ' +
                'if the first ranker results in a tie', () => {
                const specM1 = model_1.SpecQueryModel.build({
                    mark: MARK.LINE,
                    encodings: [
                        { channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const specM2 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const comparator = ranking_1.comparatorFactory(['aggregationQuality', 'effectiveness'], fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.isBelow(comparator(specM1, specM2), 0);
            });
            it('should create a comparator that uses the first orderBy to sort specs ' +
                'if the first ranker does not produce a tie', () => {
                const specM1 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const specM2 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { aggregate: 'mean', channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const comparator = ranking_1.comparatorFactory(['aggregationQuality', 'effectiveness'], fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.isBelow(comparator(specM1, specM2), 0);
            });
        });
        describe('single ranking', () => {
            it('should create a comparator that returns a value of 0 when the orderBy ranker results in a tie', () => {
                const specM1 = model_1.SpecQueryModel.build({
                    mark: MARK.LINE,
                    encodings: [
                        { channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const specM2 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const comparator = ranking_1.comparatorFactory('aggregationQuality', fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.equal(comparator(specM1, specM2), 0);
            });
            it('should create a comparator that correctly sorts two spec when passed an orderBy string of aggregationQuality', () => {
                const specM1 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const specM2 = model_1.SpecQueryModel.build({
                    mark: MARK.POINT,
                    encodings: [
                        { aggregate: 'mean', channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { aggregate: 'mean', channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE }
                    ]
                }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                const comparator = ranking_1.comparatorFactory('aggregationQuality', fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
                chai_1.assert.isBelow(comparator(specM1, specM2), 0);
            });
        });
    });
});
//# sourceMappingURL=ranking.test.js.map