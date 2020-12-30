"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_AXIS_RULESET = void 0;
const channel_1 = require("vega-lite/build/src/channel");
const type_1 = require("../../../src/ranking/effectiveness/type");
const axis_1 = require("../../../src/ranking/effectiveness/axis");
const util_1 = require("../../../src/util");
const rule_1 = require("../rule");
const scorer = new axis_1.AxisScorer();
exports.PREFERRED_AXIS_RULESET = {
    name: 'preferredAxisScore (bin, temporal)',
    rules: [].concat([type_1.BIN_Q, type_1.TIMEUNIT_T, type_1.TIMEUNIT_O, type_1.T].map((type) => {
        return {
            name: `${type}`,
            items: util_1.nestedMap([channel_1.X, channel_1.Y], (channel) => {
                return scorer.featurize(type, channel);
            })
        };
    }), [type_1.O, type_1.N].map((type) => {
        return {
            name: `${type}`,
            items: util_1.nestedMap([channel_1.Y, channel_1.X], (channel) => {
                return scorer.featurize(type, channel);
            })
        };
    }))
};
describe('preferredAxisScore', () => {
    function getPreferredAxisScore(feature) {
        return scorer.scoreIndex[feature];
    }
    rule_1.testRuleSet(exports.PREFERRED_AXIS_RULESET, getPreferredAxisScore);
});
//# sourceMappingURL=axis.test.js.map