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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EFFECTIVENESS = exports.getScore = exports.groupComparatorFactory = exports.comparatorFactory = exports.rank = exports.get = exports.register = exports.fieldOrder = exports.aggregation = void 0;
const result_1 = require("../result");
const effectiveness_1 = require("./effectiveness");
__exportStar(require("./effectiveness"), exports);
const aggregation = __importStar(require("./aggregation"));
exports.aggregation = aggregation;
const fieldOrder = __importStar(require("./fieldorder"));
exports.fieldOrder = fieldOrder;
/**
 * Registry for all encoding ranking functions
 */
let rankingRegistry = {};
/**
 * Add an ordering function to the registry.
 */
function register(name, keyFn) {
    rankingRegistry[name] = keyFn;
}
exports.register = register;
function get(name) {
    return rankingRegistry[name];
}
exports.get = get;
function rank(group, query, schema, level) {
    if (!query.nest || level === query.nest.length) {
        if (query.orderBy || query.chooseBy) {
            group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
            if (query.chooseBy) {
                if (group.items.length > 0) {
                    // for chooseBy -- only keep the top-item
                    group.items.splice(1);
                }
            }
        }
    }
    else {
        // sort lower-level nodes first because our ranking takes top-item in the subgroup
        group.items.forEach((subgroup) => {
            rank(subgroup, query, schema, level + 1);
        });
        if (query.nest[level].orderGroupBy) {
            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
        }
    }
    return group;
}
exports.rank = rank;
function comparatorFactory(name, schema, opt) {
    return (m1, m2) => {
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.comparatorFactory = comparatorFactory;
function groupComparatorFactory(name, schema, opt) {
    return (g1, g2) => {
        const m1 = result_1.getTopResultTreeItem(g1);
        const m2 = result_1.getTopResultTreeItem(g2);
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.groupComparatorFactory = groupComparatorFactory;
function getScoreDifference(name, m1, m2, schema, opt) {
    for (let rankingName of name) {
        let scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
        if (scoreDifference !== 0) {
            return scoreDifference;
        }
    }
    return 0;
}
function getScore(model, rankingName, schema, opt) {
    if (model.getRankingScore(rankingName) !== undefined) {
        return model.getRankingScore(rankingName);
    }
    const fn = get(rankingName);
    const score = fn(model, schema, opt);
    model.setRankingScore(rankingName, score);
    return score;
}
exports.getScore = getScore;
exports.EFFECTIVENESS = 'effectiveness';
register(exports.EFFECTIVENESS, effectiveness_1.effectiveness);
register(aggregation.name, aggregation.score);
register(fieldOrder.name, fieldOrder.score);
//# sourceMappingURL=ranking.js.map