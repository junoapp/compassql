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
const config_1 = require("../src/config");
const model_1 = require("../src/model");
const result_1 = require("../src/result");
const fixture_1 = require("./fixture");
describe('ResultGroup', () => {
    function buildSpecQueryModel(specQ) {
        return model_1.SpecQueryModel.build(specQ, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
    }
    function buildSpecQueryModelGroup(specQs) {
        const items = specQs.map(specQ => buildSpecQueryModel(specQ));
        return {
            name: 'a name',
            path: 'path',
            items: items
        };
    }
    describe('getTopSpecQueryModel', () => {
        it('should get top model', () => {
            const group = buildSpecQueryModelGroup([
                {
                    mark: MARK.BAR,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }]
                },
                {
                    mark: MARK.POINT,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }]
                }
            ]);
            const top = result_1.getTopResultTreeItem(group);
            chai_1.assert.equal(top.getMark(), MARK.BAR);
        });
        it('should get handle nested groups', () => {
            const group = buildSpecQueryModelGroup([
                {
                    mark: MARK.BAR,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }]
                }
            ]);
            const root = {
                name: 'root',
                path: '',
                items: [group]
            };
            const top = result_1.getTopResultTreeItem(root);
            chai_1.assert.equal(top.getMark(), MARK.BAR);
        });
    });
    describe('isResultGroup', () => {
        it('should return true for a SpecQueryModelGroup (ResultGroup<SpecQueryModel>)', () => {
            const group = {
                name: '',
                path: '',
                items: []
            };
            chai_1.assert.isTrue(result_1.isResultTree(group));
        });
    });
});
//# sourceMappingURL=result.test.js.map