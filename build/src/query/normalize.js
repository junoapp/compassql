"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
const util_1 = require("../util");
/**
 * Normalize the non-nested version of the query
 * (basically when you have a `groupBy`)
 * to a standardize nested.
 */
function normalize(q) {
    if (q.groupBy) {
        let nest = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest.orderGroupBy = q.orderBy;
        }
        let normalizedQ = {
            spec: util_1.duplicate(q.spec),
            nest: [nest],
        };
        if (q.chooseBy) {
            normalizedQ.chooseBy = q.chooseBy;
        }
        if (q.config) {
            normalizedQ.config = q.config;
        }
        return normalizedQ;
    }
    return util_1.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}
exports.normalize = normalize;
//# sourceMappingURL=normalize.js.map