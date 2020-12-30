"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_CHANNEL_RULESET = void 0;
const channel_1 = require("vega-lite/build/src/channel");
const type_1 = require("../../../src/ranking/effectiveness/type");
const typechannel_1 = require("../../../src/ranking/effectiveness/typechannel");
const util_1 = require("../../../src/util");
const rule_1 = require("../rule");
const typeChannelScorer = new typechannel_1.TypeChannelScorer();
exports.TYPE_CHANNEL_RULESET = {
    name: 'typeChannelScore (quantitative)',
    rules: [].concat([type_1.Q, type_1.T, type_1.TIMEUNIT_T].map((type) => {
        const order = [[channel_1.X, channel_1.Y], channel_1.SIZE, channel_1.COLOR, channel_1.TEXT, channel_1.OPACITY, [channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE], channel_1.DETAIL];
        return {
            name: `${type}`,
            items: util_1.nestedMap(order, (channel) => {
                return typeChannelScorer.featurize(type, channel);
            })
        };
    }), [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O].map((type) => {
        const order = [[channel_1.X, channel_1.Y], channel_1.SIZE, channel_1.COLOR, [channel_1.ROW, channel_1.COLUMN], channel_1.OPACITY, channel_1.SHAPE, channel_1.TEXT, channel_1.DETAIL];
        return {
            name: `${type}`,
            items: util_1.nestedMap(order, (channel) => {
                return typeChannelScorer.featurize(type, channel);
            })
        };
    }), [{
            name: 'nominal',
            items: util_1.nestedMap([[channel_1.X, channel_1.Y], channel_1.COLOR, channel_1.SHAPE, [channel_1.ROW, channel_1.COLUMN], channel_1.TEXT, channel_1.DETAIL, channel_1.SIZE, channel_1.OPACITY], (channel) => {
                return typeChannelScorer.featurize(type_1.N, channel);
            })
        }])
};
describe('typeChannelScore', () => {
    function getTypeChannelScore(feature) {
        return typeChannelScorer.scoreIndex[feature];
    }
    rule_1.testRuleSet(exports.TYPE_CHANNEL_RULESET, getTypeChannelScore);
});
//# sourceMappingURL=typechannel.test.js.map