"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionScorer = void 0;
const base_1 = require("./base");
const encoding_1 = require("../../query/encoding");
/**
 * Penalize if facet channels are the only dimensions
 */
class DimensionScorer extends base_1.Scorer {
    constructor() {
        super('Dimension');
    }
    initScore() {
        return {
            row: -2,
            column: -2,
            color: 0,
            opacity: 0,
            size: 0,
            shape: 0
        };
    }
    getScore(specM, _, __) {
        if (specM.isAggregate()) {
            specM.getEncodings().reduce((maxFScore, encQ) => {
                if (encoding_1.isAutoCountQuery(encQ) || (encoding_1.isFieldQuery(encQ) && !encQ.aggregate)) { // isDimension
                    const featureScore = this.getFeatureScore(`${encQ.channel}`);
                    if (featureScore && featureScore.score > maxFScore.score) {
                        return featureScore;
                    }
                }
                return maxFScore;
            }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
        }
        return [];
    }
}
exports.DimensionScorer = DimensionScorer;
//# sourceMappingURL=dimension.js.map