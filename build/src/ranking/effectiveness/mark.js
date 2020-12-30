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
exports.featurize = exports.MarkScorer = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const MARK = __importStar(require("vega-lite/build/src/mark"));
const util_1 = require("../../util");
const base_1 = require("./base");
const type_1 = require("./type");
class MarkScorer extends base_1.Scorer {
    constructor() {
        super('Mark');
    }
    initScore() {
        return init();
    }
    getScore(specM, _, __) {
        let mark = specM.getMark();
        if (mark === MARK.CIRCLE || mark === MARK.SQUARE) {
            mark = MARK.POINT;
        }
        const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
        const xType = xEncQ ? type_1.getExtendedType(xEncQ) : type_1.NONE;
        const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
        const yType = yEncQ ? type_1.getExtendedType(yEncQ) : type_1.NONE;
        const isOccluded = !specM.isAggregate(); // FIXME
        const feature = `${xType}_${yType}_${isOccluded}_${mark}`;
        const featureScore = this.getFeatureScore(feature);
        if (featureScore) {
            return [featureScore];
        }
        console.error('feature score missing for', feature);
        return [];
    }
}
exports.MarkScorer = MarkScorer;
function featurize(xType, yType, hasOcclusion, mark) {
    return `${xType}_${yType}_${hasOcclusion}_${mark}`;
}
exports.featurize = featurize;
function init() {
    const MEASURES = [type_1.Q, type_1.T];
    const DISCRETE = [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O, type_1.N, type_1.K];
    const DISCRETE_OR_NONE = DISCRETE.concat([type_1.NONE]);
    let SCORE = {};
    // QxQ
    MEASURES.forEach(xType => {
        MEASURES.forEach(yType => {
            // has occlusion
            const occludedQQMark = {
                point: 0,
                text: -0.2,
                tick: -0.5,
                rect: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedQQMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            // no occlusion
            // TODO: possible to use connected scatter plot
            const noOccludedQQMark = {
                point: 0,
                text: -0.2,
                tick: -0.5,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(noOccludedQQMark, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        });
    });
    // DxQ, QxD
    MEASURES.forEach(xType => {
        // HAS OCCLUSION
        DISCRETE_OR_NONE.forEach(yType => {
            const occludedDimensionMeasureMark = {
                tick: 0,
                point: -0.2,
                text: -0.5,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedDimensionMeasureMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
                // also do the inverse
                const feature2 = featurize(yType, xType, true, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.TIMEUNIT_T].forEach(yType => {
            const occludedDimensionMeasureMark = {
                // For Time Dimension with time scale, tick is not good
                point: 0,
                text: -0.5,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedDimensionMeasureMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
                // also do the inverse
                const feature2 = featurize(yType, xType, true, mark);
                SCORE[feature2] = score;
            });
        });
        // NO OCCLUSION
        [type_1.NONE, type_1.N, type_1.O, type_1.K].forEach(yType => {
            const noOccludedQxN = {
                bar: 0,
                point: -0.2,
                tick: -0.25,
                text: -0.3,
                // Line / Area can mislead trend for N
                line: -2,
                area: -2,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxN, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                const feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.BIN_Q].forEach(yType => {
            const noOccludedQxBinQ = {
                bar: 0,
                point: -0.2,
                tick: -0.25,
                text: -0.3,
                // Line / Area isn't the best fit for bin
                line: -0.5,
                area: -0.5,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxBinQ, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                const feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.TIMEUNIT_T, type_1.TIMEUNIT_O].forEach(yType => {
            // For aggregate / surely no occlusion plot, Temporal with time or ordinal
            // are not that different.
            const noOccludedQxBinQ = {
                line: 0,
                area: -0.1,
                bar: -0.2,
                point: -0.3,
                tick: -0.35,
                text: -0.4,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxBinQ, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                const feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
    });
    [type_1.TIMEUNIT_T].forEach(xType => {
        [type_1.TIMEUNIT_T].forEach(yType => {
            // has occlusion
            const ttMark = {
                point: 0,
                rect: -0.1,
                text: -0.5,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            // No difference between has occlusion and no occlusion
            // as most of the time, it will be the occluded case.
            util_1.forEach(ttMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(ttMark, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        });
        DISCRETE_OR_NONE.forEach(yType => {
            // has occlusion
            const tdMark = {
                tick: 0,
                point: -0.2,
                text: -0.5,
                rect: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            // No difference between has occlusion and no occlusion
            // as most of the time, it will be the occluded case.
            util_1.forEach(tdMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, (score, mark) => {
                const feature = featurize(yType, xType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, (score, mark) => {
                const feature = featurize(yType, xType, false, mark);
                SCORE[feature] = score;
            });
        });
    });
    // DxD
    // Note: We use for loop here because using forEach sometimes leads to a mysterious bug
    for (const xType of DISCRETE_OR_NONE) {
        for (const yType of DISCRETE_OR_NONE) {
            // has occlusion
            const ddMark = {
                point: 0,
                rect: 0,
                text: -0.1,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(ddMark, (score, mark) => {
                const feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            // same for no occlusion.
            util_1.forEach(ddMark, (score, mark) => {
                const feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        }
    }
    return SCORE;
}
//# sourceMappingURL=mark.js.map