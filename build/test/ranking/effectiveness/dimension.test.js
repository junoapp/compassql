"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_DIMENSION_RULESET = void 0;
const channel_1 = require("vega-lite/build/src/channel");
const dimension_1 = require("../../../src/ranking/effectiveness/dimension");
const rule_1 = require("../rule");
const scorer = new dimension_1.DimensionScorer();
exports.PREFERRED_DIMENSION_RULESET = {
    name: 'dimensionScore',
    rules: [{
            name: 'dimensionScore',
            items: [[channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY, channel_1.SHAPE], [channel_1.ROW, channel_1.COLUMN]]
        }]
};
describe('dimensionScore', () => {
    function getDimensionScore(feature) {
        return scorer.scoreIndex[feature];
    }
    rule_1.testRuleSet(exports.PREFERRED_DIMENSION_RULESET, getDimensionScore);
});
//# sourceMappingURL=dimension.test.js.map