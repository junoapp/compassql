"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_FACET_RULESET = void 0;
const channel_1 = require("vega-lite/build/src/channel");
const facet_1 = require("../../../src/ranking/effectiveness/facet");
const rule_1 = require("../rule");
const scorer = new facet_1.FacetScorer();
exports.PREFERRED_FACET_RULESET = {
    name: 'preferredFacetScore',
    rules: [{
            name: 'preferredFacetScore',
            items: [channel_1.ROW, channel_1.COLUMN]
        }]
};
describe('preferredFacetScore', () => {
    function getPreferredFacetScore(feature) {
        return scorer.scoreIndex[feature];
    }
    rule_1.testRuleSet(exports.PREFERRED_FACET_RULESET, getPreferredFacetScore);
});
//# sourceMappingURL=facet.test.js.map