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
exports.score = exports.name = void 0;
const TYPE = __importStar(require("vega-lite/build/src/type"));
const encoding_1 = require("../query/encoding");
const util_1 = require("../util");
exports.name = 'aggregationQuality';
function score(specM, schema, opt) {
    const feature = aggregationQualityFeature(specM, schema, opt);
    return {
        score: feature.score,
        features: [feature]
    };
}
exports.score = score;
function aggregationQualityFeature(specM, _, __) {
    const encodings = specM.getEncodings();
    if (specM.isAggregate()) {
        const isRawContinuous = (encQ) => {
            return (encoding_1.isFieldQuery(encQ) &&
                ((encQ.type === TYPE.QUANTITATIVE && !encQ.bin && !encQ.aggregate) ||
                    (encQ.type === TYPE.TEMPORAL && !encQ.timeUnit)));
        };
        if (util_1.some(encodings, isRawContinuous)) {
            // These are plots that pollute continuous fields as dimension.
            // They are often intermediate visualizations rather than what users actually want.
            return {
                type: exports.name,
                score: 0.1,
                feature: 'Aggregate with raw continuous'
            };
        }
        if (util_1.some(encodings, encQ => encoding_1.isFieldQuery(encQ) && encoding_1.isDimension(encQ))) {
            let hasCount = util_1.some(encodings, (encQ) => {
                return (encoding_1.isFieldQuery(encQ) && encQ.aggregate === 'count') || encoding_1.isEnabledAutoCountQuery(encQ);
            });
            let hasBin = util_1.some(encodings, (encQ) => {
                return encoding_1.isFieldQuery(encQ) && !!encQ.bin;
            });
            if (hasCount) {
                // If there is count, we might add additional count field, making it a little less simple
                // then when we just apply aggregate to Q field
                return {
                    type: exports.name,
                    score: 0.8,
                    feature: 'Aggregate with count'
                };
            }
            else if (hasBin) {
                // This is not as good as binning all the Q and show heatmap
                return {
                    type: exports.name,
                    score: 0.7,
                    feature: 'Aggregate with bin but without count'
                };
            }
            else {
                return {
                    type: exports.name,
                    score: 0.9,
                    feature: 'Aggregate without count and without bin'
                };
            }
        }
        // no dimension -- often not very useful
        return {
            type: exports.name,
            score: 0.3,
            feature: 'Aggregate without dimension'
        };
    }
    else {
        if (util_1.some(encodings, encQ => encoding_1.isFieldQuery(encQ) && !encoding_1.isDimension(encQ))) {
            // raw plots with measure -- simplest of all!
            return {
                type: exports.name,
                score: 1,
                feature: 'Raw with measure'
            };
        }
        // raw plots with no measure -- often a lot of occlusion
        return {
            type: exports.name,
            score: 0.2,
            feature: 'Raw without measure'
        };
    }
}
//# sourceMappingURL=aggregation.js.map