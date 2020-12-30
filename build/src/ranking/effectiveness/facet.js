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
exports.FacetScorer = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const config_1 = require("../../config");
const encoding_1 = require("../../query/encoding");
const base_1 = require("./base");
/**
 * Effective Score for preferred facet
 */
class FacetScorer extends base_1.Scorer {
    constructor() {
        super('Facet');
    }
    initScore(opt) {
        opt = Object.assign(Object.assign({}, config_1.DEFAULT_QUERY_CONFIG), opt);
        let score = {};
        if (opt.preferredFacet === CHANNEL.ROW) {
            // penalize the other axis
            score[CHANNEL.COLUMN] = -0.01;
        }
        else if (opt.preferredFacet === CHANNEL.COLUMN) {
            // penalize the other axis
            score[CHANNEL.ROW] = -0.01;
        }
        return score;
    }
    getScore(specM, _, __) {
        return specM.getEncodings().reduce((features, encQ) => {
            if (encoding_1.isFieldQuery(encQ) || encoding_1.isAutoCountQuery(encQ)) {
                const featureScore = this.getFeatureScore(encQ.channel);
                if (featureScore) {
                    features.push(featureScore);
                }
            }
            return features;
        }, []);
    }
}
exports.FacetScorer = FacetScorer;
//# sourceMappingURL=facet.js.map