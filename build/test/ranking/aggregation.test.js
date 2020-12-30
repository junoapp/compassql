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
const aggregate_1 = require("vega-lite/build/src/aggregate");
const timeunit_1 = require("vega-lite/build/src/timeunit");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../../src/config");
const model_1 = require("../../src/model");
const aggregation_1 = require("../../src/ranking/aggregation");
const wildcard_1 = require("../../src/wildcard");
const fixture_1 = require("../fixture");
const rule_1 = require("./rule");
function getScore(shortenedFields) {
    const encodings = shortenedFields.split('x').map((shortenedEncQ) => {
        let encQ = { channel: wildcard_1.SHORT_WILDCARD };
        const split = shortenedEncQ.trim().split('_');
        const field = (encQ.field = split.length > 1 ? split[1] : split[0]);
        encQ.type = field === '*' ? TYPE.QUANTITATIVE : fixture_1.schema.vlType(field);
        if (split.length > 1) {
            const fn = split[0];
            if (fn === 'bin') {
                encQ.bin = true;
            }
            else if (timeunit_1.isUTCTimeUnit(fn) || timeunit_1.isLocalSingleTimeUnit(fn)) {
                encQ.timeUnit = fn;
            }
            else if (aggregate_1.isAggregateOp(fn)) {
                encQ.aggregate = fn;
            }
        }
        return encQ;
    });
    const specM = model_1.SpecQueryModel.build({
        mark: wildcard_1.SHORT_WILDCARD,
        encodings: encodings
    }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
    return aggregation_1.score(specM, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG).score;
}
describe('ranking/aggregation', () => {
    describe('aggregationQuality', () => {
        const SUMMARY_RULESET = {
            name: 'aggregationQuality',
            rules: [
                {
                    name: '1D',
                    items: [['Q', 'T'], ['bin_Q x count_*', 'year_T x count_*'], 'mean_Q', ['O', 'N']]
                },
                {
                    name: '2D',
                    items: [
                        [
                            'NxQ',
                            'TxQ',
                            'QxQ',
                            'NxT',
                            'year_TxQ',
                            'TxT1',
                            'Txyear_T1' // TODO: possibly move these two to the next tier
                        ],
                        ['N x mean_Q', 'year_T x mean_Q'],
                        [
                            'N x N x count_*',
                            'N x year_T x count_*',
                            'N x bin_Q x count_*',
                            'year_T x year_T1 x count_*',
                            'year_T x bin_Q x count_*',
                            'bin_Q x bin_Q1 x count_*'
                        ],
                        ['bin_Q x mean_Q1'],
                        ['mean_Q x mean_Q'],
                        ['NxN', 'N x year_T', 'N x bin_Q', 'year_T x year_T1', 'year_T x bin_Q', 'bin_Q x bin_Q1'],
                        ['T x mean_Q', 'Q x mean_Q'] // FIXME this is not necessarily bad depending on the data distribution
                    ]
                }
            ]
        };
        rule_1.testRuleSet(SUMMARY_RULESET, getScore);
    });
});
//# sourceMappingURL=aggregation.test.js.map