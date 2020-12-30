"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommend = void 0;
const config_1 = require("./config");
const generate_1 = require("./generate");
const nest_1 = require("./nest");
const normalize_1 = require("./query/normalize");
const ranking_1 = require("./ranking/ranking");
function recommend(q, schema, config) {
    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
    //    and merge config with the following precedence
    //    query.config > config > DEFAULT_QUERY_CONFIG
    q = Object.assign(Object.assign({}, normalize_1.normalize(q)), { config: Object.assign(Object.assign(Object.assign({}, config_1.DEFAULT_QUERY_CONFIG), config), q.config) });
    // 2. Generate
    const answerSet = generate_1.generate(q.spec, schema, q.config);
    const nestedAnswerSet = nest_1.nest(answerSet, q.nest);
    const result = ranking_1.rank(nestedAnswerSet, q, schema, 0);
    return {
        query: q,
        result: result
    };
}
exports.recommend = recommend;
//# sourceMappingURL=recommend.js.map