"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRuleSet = void 0;
const chai_1 = require("chai");
const util_1 = require("datalib/src/util");
function testRuleSet(ruleSet, getScore, stringify = JSON.stringify) {
    ruleSet.rules.forEach((rule) => {
        it(`should preserve ranking order for ${rule.name}`, () => {
            const items = rule.items;
            for (let i = 1; i < items.length; i++) {
                const l = items[i - 1];
                const r = items[i];
                (util_1.isArray(l) ? l : [l]).forEach((left) => {
                    (util_1.isArray(r) ? r : [r]).forEach((right) => {
                        const lScore = getScore(left) || 0;
                        const rScore = getScore(right) || 0;
                        chai_1.assert.isTrue(lScore > rScore, `Score for ${stringify(left)} (${lScore.toFixed(3)}) ` +
                            'should > ' + stringify(right) + ' (' + rScore.toFixed(3) + ')');
                    });
                });
            }
        });
    });
}
exports.testRuleSet = testRuleSet;
//# sourceMappingURL=rule.js.map