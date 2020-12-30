"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeChannelScorer = void 0;
const base_1 = require("./base");
const encoding_1 = require("../../query/encoding");
/**
 * Effectivenss score that penalize size for bar and tick
 */
class SizeChannelScorer extends base_1.Scorer {
    constructor() {
        super('SizeChannel');
    }
    initScore() {
        return {
            bar_size: -2,
            tick_size: -2
        };
    }
    getScore(specM, _, __) {
        const mark = specM.getMark();
        return specM.getEncodings().reduce((featureScores, encQ) => {
            if (encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) {
                const feature = `${mark}_${encQ.channel}`;
                const featureScore = this.getFeatureScore(feature);
                if (featureScore) {
                    featureScores.push(featureScore);
                }
            }
            return featureScores;
        }, []);
    }
}
exports.SizeChannelScorer = SizeChannelScorer;
//# sourceMappingURL=sizechannel.js.map