"use strict";
/// <reference path="../typings/json.d.ts" />
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
exports.util = exports.schema = exports.result = exports.ranking = exports.query = exports.property = exports.nest = exports.model = exports.wildcard = exports.enumerate = exports.constraint = exports.config = exports.version = exports.recommend = exports.generate = void 0;
const config = __importStar(require("./config"));
exports.config = config;
const constraint = __importStar(require("./constraint"));
exports.constraint = constraint;
const enumerate = __importStar(require("./enumerator"));
exports.enumerate = enumerate;
const wildcard = __importStar(require("./wildcard"));
exports.wildcard = wildcard;
const model = __importStar(require("./model"));
exports.model = model;
const nest = __importStar(require("./nest"));
exports.nest = nest;
const property = __importStar(require("./property"));
exports.property = property;
const query = __importStar(require("./query"));
exports.query = query;
const ranking = __importStar(require("./ranking/ranking"));
exports.ranking = ranking;
const result = __importStar(require("./result"));
exports.result = result;
const schema = __importStar(require("./schema"));
exports.schema = schema;
const util = __importStar(require("./util"));
exports.util = util;
var generate_1 = require("./generate");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generate_1.generate; } });
var recommend_1 = require("./recommend");
Object.defineProperty(exports, "recommend", { enumerable: true, get: function () { return recommend_1.recommend; } });
var package_json_1 = require("./package.json");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return package_json_1.version; } });
//# sourceMappingURL=index.js.map