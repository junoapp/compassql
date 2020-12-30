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
const chai_1 = require("chai");
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const MARK = __importStar(require("vega-lite/build/src/mark"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const query_1 = require("../../src/query");
describe('query', () => {
    describe('normalize', () => {
        it('should correctly normalize query', () => {
            const q = {
                spec: {
                    mark: MARK.POINT,
                    encodings: [{ channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE }]
                },
                groupBy: 'fieldTransform',
                chooseBy: 'effectiveness',
                orderBy: 'effectiveness'
            };
            chai_1.assert.deepEqual(query_1.normalize(q), {
                spec: {
                    mark: MARK.POINT,
                    encodings: [{ channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE }]
                },
                nest: [
                    {
                        groupBy: 'fieldTransform',
                        orderGroupBy: 'effectiveness'
                    }
                ],
                chooseBy: 'effectiveness'
            });
        });
    });
});
//# sourceMappingURL=normalize.test.js.map