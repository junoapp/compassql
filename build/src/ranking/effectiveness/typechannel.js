"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeChannelScorer = exports.TERRIBLE = void 0;
const shorthand_1 = require("../../query/shorthand");
const encoding_1 = require("../../query/encoding");
const util_1 = require("../../util");
const type_1 = require("./type");
const base_1 = require("./base");
exports.TERRIBLE = -10;
/**
 * Effectiveness score for relationship between
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
class TypeChannelScorer extends base_1.Scorer {
    constructor() {
        super('TypeChannel');
    }
    initScore() {
        let SCORE = {};
        // Continuous Quantitative / Temporal Fields
        const CONTINUOUS_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            size: -0.575,
            color: -0.725,
            text: -2,
            opacity: -3,
            shape: exports.TERRIBLE,
            row: exports.TERRIBLE,
            column: exports.TERRIBLE,
            detail: 2 * exports.TERRIBLE
        };
        [type_1.Q, type_1.T, type_1.TIMEUNIT_T].forEach((type) => {
            util_1.keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach((channel) => {
                SCORE[this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
            });
        });
        // Discretized Quantitative / Temporal Fields / Ordinal
        const ORDERED_TYPE_CHANNEL_SCORE = util_1.extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
            row: -0.75,
            column: -0.75,
            shape: -3.1,
            text: -3.2,
            detail: -4
        });
        [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O].forEach((type) => {
            util_1.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach((channel) => {
                SCORE[this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
            });
        });
        const NOMINAL_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            color: -0.6,
            shape: -0.65,
            row: -0.7,
            column: -0.7,
            text: -0.8,
            detail: -2,
            size: -3,
            opacity: -3.1,
        };
        util_1.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach((channel) => {
            SCORE[this.featurize(type_1.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
            SCORE[this.featurize(type_1.K, channel)] =
                // Putting key on position or detail isn't terrible
                util_1.contains(['x', 'y', 'detail'], channel) ? -1 :
                    NOMINAL_TYPE_CHANNEL_SCORE[channel] - 2;
        });
        return SCORE;
    }
    featurize(type, channel) {
        return `${type}_${channel}`;
    }
    getScore(specM, schema, opt) {
        const encodingQueryByField = specM.getEncodings().reduce((m, encQ) => {
            if (encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) {
                const fieldKey = shorthand_1.fieldDef(encQ);
                (m[fieldKey] = m[fieldKey] || []).push(encQ);
            }
            return m;
        }, {});
        const features = [];
        util_1.forEach(encodingQueryByField, (encQs) => {
            const bestFieldFeature = encQs.reduce((best, encQ) => {
                if (encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) {
                    const type = type_1.getExtendedType(encQ);
                    const feature = this.featurize(type, encQ.channel);
                    const featureScore = this.getFeatureScore(feature);
                    if (best === null || featureScore.score > best.score) {
                        return featureScore;
                    }
                }
                return best;
            }, null);
            features.push(bestFieldFeature);
            // TODO: add plus for over-encoding of one field
        });
        return features;
    }
}
exports.TypeChannelScorer = TypeChannelScorer;
//# sourceMappingURL=typechannel.js.map