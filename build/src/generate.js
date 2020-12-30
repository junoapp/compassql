"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const config_1 = require("./config");
const enumerator_1 = require("./enumerator");
const model_1 = require("./model");
const property_1 = require("./property");
const stylize_1 = require("./stylize");
function generate(specQ, schema, opt = config_1.DEFAULT_QUERY_CONFIG) {
    // 1. Build a SpecQueryModel, which also contains wildcardIndex
    const specM = model_1.SpecQueryModel.build(specQ, schema, opt);
    const wildcardIndex = specM.wildcardIndex;
    // 2. Enumerate each of the properties based on propPrecedence.
    let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
    opt.propertyPrecedence.forEach((propKey) => {
        const prop = property_1.fromKey(propKey);
        // If the original specQuery contains wildcard for this prop
        if (wildcardIndex.hasProperty(prop)) {
            // update answerset
            const enumerator = enumerator_1.getEnumerator(prop);
            const reducer = enumerator(wildcardIndex, schema, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    if (opt.stylize) {
        if ((opt.nominalColorScaleForHighCardinality !== null) ||
            (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
            return stylize_1.stylize(answerSet, schema, opt);
        }
    }
    return answerSet;
}
exports.generate = generate;
//# sourceMappingURL=generate.js.map