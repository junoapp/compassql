"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DD_RULESET = exports.TD_RULESET = exports.TT_RULESET = exports.CD_RULESET = exports.CC_RULESET = void 0;
const mark_1 = require("vega-lite/build/src/mark");
const type_1 = require("../../../src/ranking/effectiveness/type");
const mark_2 = require("../../../src/ranking/effectiveness/mark");
const util_1 = require("../../../src/util");
const rule_1 = require("../rule");
const scorer = new mark_2.MarkScorer();
function getScore(feature) {
    return scorer.scoreIndex[feature];
}
exports.CC_RULESET = {
    name: 'Continous-Continuous Plots',
    rules: function () {
        const _rules = [];
        [type_1.Q, type_1.T].forEach((xType) => {
            [type_1.Q, type_1.T].forEach((yType) => {
                const continuousRank = [mark_1.POINT, mark_1.TEXT, mark_1.TICK, [mark_1.BAR, mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${xType} x ${yType} (with occlusion)`,
                    items: util_1.nestedMap(continuousRank, (mark) => {
                        return mark_2.featurize(xType, yType, true, mark);
                    })
                });
                _rules.push({
                    name: `${xType} x ${yType} (without occlusion)`,
                    items: util_1.nestedMap(continuousRank, (mark) => {
                        return mark_2.featurize(xType, yType, false, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
        });
        return _rules;
    }()
};
exports.CD_RULESET = {
    name: 'Continous-Discrete Plots',
    rules: function () {
        const _rules = [];
        [type_1.Q, type_1.T].forEach((measureType) => {
            // Has Occlusion
            [type_1.TIMEUNIT_O, type_1.O, type_1.BIN_Q, type_1.N].forEach((dimensionType) => {
                const dimWithOcclusionRank = [mark_1.TICK, mark_1.POINT, mark_1.TEXT, [mark_1.LINE, mark_1.AREA, mark_1.BAR], mark_1.RULE];
                _rules.push({
                    name: `${measureType} x ${dimensionType} (with occlusion)`,
                    items: util_1.nestedMap(dimWithOcclusionRank, (mark) => {
                        return mark_2.featurize(measureType, dimensionType, true, mark);
                    })
                });
                _rules.push({
                    name: `${dimensionType} x ${measureType} (with occlusion)`,
                    items: util_1.nestedMap(dimWithOcclusionRank, (mark) => {
                        return mark_2.featurize(dimensionType, measureType, true, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
            [type_1.TIMEUNIT_T].forEach((dimensionType) => {
                const dimWithOcclusionRank = [mark_1.POINT, mark_1.TEXT, mark_1.TICK, [mark_1.LINE, mark_1.AREA, mark_1.BAR], mark_1.RULE];
                _rules.push({
                    name: `${measureType} x ${dimensionType} (with occlusion)`,
                    items: util_1.nestedMap(dimWithOcclusionRank, (mark) => {
                        return mark_2.featurize(measureType, dimensionType, true, mark);
                    })
                });
                _rules.push({
                    name: `${dimensionType} x ${measureType} (with occlusion)`,
                    items: util_1.nestedMap(dimWithOcclusionRank, (mark) => {
                        return mark_2.featurize(dimensionType, measureType, true, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
            // No Occlusion
            [type_1.TIMEUNIT_O, type_1.TIMEUNIT_T].forEach((dimensionType) => {
                const orderedDimNoOcclusionRank = [mark_1.LINE, mark_1.AREA, mark_1.BAR, mark_1.POINT, mark_1.TICK, mark_1.TEXT, mark_1.RULE];
                _rules.push({
                    name: `${measureType} x ${dimensionType} (without occlusion)`,
                    items: util_1.nestedMap(orderedDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(measureType, dimensionType, false, mark);
                    })
                });
                _rules.push({
                    name: `${dimensionType} x ${measureType} (without occlusion)`,
                    items: util_1.nestedMap(orderedDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(dimensionType, measureType, false, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
            [type_1.BIN_Q].forEach((dimensionType) => {
                const binDimNoOcclusionRank = [mark_1.BAR, mark_1.POINT, mark_1.TICK, mark_1.TEXT, [mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${measureType} x ${dimensionType} (without occlusion)`,
                    items: util_1.nestedMap(binDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(measureType, dimensionType, false, mark);
                    })
                });
                _rules.push({
                    name: `${dimensionType} x ${measureType} (without occlusion)`,
                    items: util_1.nestedMap(binDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(dimensionType, measureType, false, mark);
                    })
                });
                // TODO: RULE should be terrible
            });
            [type_1.N, type_1.O].forEach((dimensionType) => {
                const binDimNoOcclusionRank = [mark_1.BAR, mark_1.POINT, mark_1.TICK, mark_1.TEXT, [mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${measureType} x ${dimensionType} (without occlusion)`,
                    items: util_1.nestedMap(binDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(measureType, dimensionType, false, mark);
                    })
                });
                _rules.push({
                    name: `${dimensionType} x ${measureType} (without occlusion)`,
                    items: util_1.nestedMap(binDimNoOcclusionRank, (mark) => {
                        return mark_2.featurize(dimensionType, measureType, false, mark);
                    })
                });
                // TODO: LINE, AREA, RULE should be terrible
            });
        });
        return _rules;
    }()
};
exports.TT_RULESET = {
    name: 'TimeUnitTime-TimeUnitTime',
    rules: function () {
        const _rules = [];
        [type_1.TIMEUNIT_T].forEach((xType) => {
            [type_1.TIMEUNIT_T].forEach((yType) => {
                const ddRank = [mark_1.POINT, mark_1.TEXT, mark_1.TICK, [mark_1.BAR, mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${xType} x ${yType} (with occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, true, mark);
                    })
                });
                _rules.push({
                    name: `${xType} x ${yType} (without occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, false, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
        });
        return _rules;
    }()
};
exports.TD_RULESET = {
    name: 'TimeUnitTime-Discrete Plots',
    rules: function () {
        const _rules = [];
        [type_1.TIMEUNIT_T].forEach((xType) => {
            [type_1.TIMEUNIT_O, type_1.O, type_1.BIN_Q, type_1.N].forEach((yType) => {
                const ddRank = [mark_1.TICK, mark_1.POINT, mark_1.TEXT, [mark_1.BAR, mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${xType} x ${yType} (with occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, true, mark);
                    })
                });
                _rules.push({
                    name: `${xType} x ${yType} (without occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, false, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
        });
        return _rules;
    }()
};
exports.DD_RULESET = {
    name: 'Discrete-Discrete Plots',
    rules: function () {
        const _rules = [];
        [type_1.TIMEUNIT_O, type_1.O, type_1.BIN_Q, type_1.N].forEach((xType) => {
            [type_1.TIMEUNIT_O, type_1.O, type_1.BIN_Q, type_1.N].forEach((yType) => {
                const ddRank = [[mark_1.POINT, mark_1.RECT], mark_1.TEXT, mark_1.TICK, [mark_1.BAR, mark_1.LINE, mark_1.AREA], mark_1.RULE];
                _rules.push({
                    name: `${xType} x ${yType} (with occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, true, mark);
                    })
                });
                // the same for no occlusion.
                _rules.push({
                    name: `${xType} x ${yType} (without occlusion)`,
                    items: util_1.nestedMap(ddRank, (mark) => {
                        return mark_2.featurize(xType, yType, false, mark);
                    })
                });
                // TODO: BAR, LINE, AREA, RULE should be terrible
            });
        });
        return _rules;
    }()
};
describe('markScore', () => {
    [exports.CC_RULESET, exports.CD_RULESET, exports.TT_RULESET, exports.TD_RULESET, exports.DD_RULESET].forEach((ruleSet) => {
        describe(ruleSet.name, () => {
            rule_1.testRuleSet(ruleSet, getScore);
        });
    });
});
//# sourceMappingURL=mark.test.js.map