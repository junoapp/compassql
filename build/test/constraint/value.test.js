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
const config_1 = require("../../src/config");
const value_1 = require("../../src/constraint/value");
const propindex_1 = require("../../src/propindex");
const util_1 = require("../../src/util");
const fixture_1 = require("../fixture");
describe('constraints/value', () => {
    const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, {
        constraintManuallySpecifiedValue: true
    });
    describe('Value Constraint Checks', () => {
        it('should return true if value is not a constant', () => {
            const validValueQ = {
                value: 'color',
                channel: CHANNEL.COLOR
            };
            chai_1.assert.isTrue(value_1.VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(validValueQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
        });
        it('should return false if value is a constant', () => {
            ['row', 'column', 'x', 'y', 'detail'].forEach((channel) => {
                const invalidValueQ = {
                    value: channel,
                    channel
                };
                chai_1.assert.isFalse(value_1.VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(invalidValueQ, fixture_1.schema, new propindex_1.PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
    });
});
//# sourceMappingURL=value.test.js.map