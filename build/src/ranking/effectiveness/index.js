"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectiveness = void 0;
const axis_1 = require("./axis");
const dimension_1 = require("./dimension");
const facet_1 = require("./facet");
const sizechannel_1 = require("./sizechannel");
const typechannel_1 = require("./typechannel");
const mark_1 = require("./mark");
const SCORERS = [
    new axis_1.AxisScorer(),
    new dimension_1.DimensionScorer(),
    new facet_1.FacetScorer(),
    new mark_1.MarkScorer(),
    new sizechannel_1.SizeChannelScorer(),
    new typechannel_1.TypeChannelScorer()
];
// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding
function effectiveness(specM, schema, opt) {
    const features = SCORERS.reduce((f, scorer) => {
        const scores = scorer.getScore(specM, schema, opt);
        return f.concat(scores);
    }, []);
    return {
        score: features.reduce((s, f) => {
            return s + f.score;
        }, 0),
        features: features
    };
}
exports.effectiveness = effectiveness;
//# sourceMappingURL=index.js.map