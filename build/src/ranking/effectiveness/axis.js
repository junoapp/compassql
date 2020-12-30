"use strict";
/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
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
exports.AxisScorer = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const config_1 = require("../../config");
const encoding_1 = require("../../query/encoding");
const base_1 = require("./base");
const type_1 = require("./type");
/**
 * Effectiveness Score for preferred axis.
 */
class AxisScorer extends base_1.Scorer {
    constructor() {
        super('Axis');
    }
    initScore(opt = {}) {
        opt = Object.assign(Object.assign({}, config_1.DEFAULT_QUERY_CONFIG), opt);
        let score = {};
        const preferredAxes = [
            {
                feature: type_1.BIN_Q,
                opt: 'preferredBinAxis'
            },
            {
                feature: type_1.T,
                opt: 'preferredTemporalAxis'
            },
            {
                feature: type_1.TIMEUNIT_T,
                opt: 'preferredTemporalAxis'
            },
            {
                feature: type_1.TIMEUNIT_O,
                opt: 'preferredTemporalAxis'
            },
            {
                feature: type_1.O,
                opt: 'preferredOrdinalAxis'
            },
            {
                feature: type_1.N,
                opt: 'preferredNominalAxis'
            }
        ];
        preferredAxes.forEach(pAxis => {
            if (opt[pAxis.opt] === CHANNEL.X) {
                // penalize the other axis
                score[`${pAxis.feature}_${CHANNEL.Y}`] = -0.01;
            }
            else if (opt[pAxis.opt] === CHANNEL.Y) {
                // penalize the other axis
                score[`${pAxis.feature}_${CHANNEL.X}`] = -0.01;
            }
        });
        return score;
    }
    featurize(type, channel) {
        return `${type}_${channel}`;
    }
    getScore(specM, _, __) {
        return specM.getEncodings().reduce((features, encQ) => {
            if (encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) {
                const type = type_1.getExtendedType(encQ);
                const feature = this.featurize(type, encQ.channel);
                const featureScore = this.getFeatureScore(feature);
                if (featureScore) {
                    features.push(featureScore);
                }
            }
            return features;
        }, []);
    }
}
exports.AxisScorer = AxisScorer;
//# sourceMappingURL=axis.js.map