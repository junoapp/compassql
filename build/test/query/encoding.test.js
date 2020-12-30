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
const scale_1 = require("vega-lite/build/src/scale");
const timeunit_1 = require("vega-lite/build/src/timeunit");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const encoding_1 = require("../../src/query/encoding");
const wildcard_1 = require("../../src/wildcard");
const TIMEUNITS = Object.keys(timeunit_1.LOCAL_SINGLE_TIMEUNIT_INDEX).concat(Object.keys(timeunit_1.UTC_SINGLE_TIMEUNIT_INDEX), Object.keys(timeunit_1.LOCAL_MULTI_TIMEUNIT_INDEX), Object.keys(timeunit_1.UTC_MULTI_TIMEUNIT_INDEX));
describe('query/encoding', () => {
    describe('toFieldDef', () => {
        it('return correct fieldDef for autoCount', () => {
            chai_1.assert.deepEqual(encoding_1.toFieldDef({ channel: 'x', autoCount: true, type: 'quantitative' }), {
                aggregate: 'count',
                field: '*',
                type: 'quantitative'
            });
        });
        it('return correct fieldDef for FieldQuery', () => {
            chai_1.assert.deepEqual(encoding_1.toFieldDef({ bin: false, channel: 'x', field: 'Q', type: 'quantitative' }, { props: ['bin', 'timeUnit', 'type'], wildcardMode: 'skip' }), { type: 'quantitative' });
        });
        it('return correct fieldDef for Text FieldQuery with format', () => {
            chai_1.assert.deepEqual(encoding_1.toFieldDef({ format: '.3f', channel: 'text', field: 'Q', type: 'quantitative' }, { props: ['field', 'format', 'type'], wildcardMode: 'skip' }), { format: '.3f', field: 'Q', type: 'quantitative' });
        });
    });
    describe('toValueDef', () => {
        it('return correct ValueDef for ValueQuery with constant', () => {
            chai_1.assert.deepEqual(encoding_1.toValueDef({ channel: 'x', value: 5 }), { value: 5 });
        });
        it('return correct null for ValueQuery with wildcard', () => {
            chai_1.assert.deepEqual(encoding_1.toValueDef({ channel: 'x', value: '?' }), null);
        });
    });
    describe('scaleType', () => {
        it('should return specified scale type if it is valid', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                scale: { type: scale_1.ScaleType.LINEAR },
                type: 'quantitative'
            });
            chai_1.assert.equal(sType, scale_1.ScaleType.LINEAR);
        });
        it('should return undefined if scale.type is a wildcard', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                scale: { type: '?' },
                type: 'quantitative'
            });
            chai_1.assert.equal(sType, undefined);
        });
        it('should return undefined if type is a wildcard', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                type: '?'
            });
            chai_1.assert.equal(sType, undefined);
        });
        it('should return undefined if channel is a wildcard', () => {
            const sType = encoding_1.scaleType({
                channel: '?',
                type: 'quantitative'
            });
            chai_1.assert.equal(sType, undefined);
        });
        // These tests are for the commented rule in the scaleType() function.
        // it('should return undefined if channel is x/y and scale.rangeStep is a short wildcard', () => {
        //   const sType = scaleType({
        //     channel: 'x',
        //     type: 'quantitative',
        //     scale: {rangeStep: '?'}
        //   });
        //   assert.equal(sType, undefined);
        // });
        // it('should return undefined if channel is x/y and scale.rangeStep is a wildcard that contains undefined', () => {
        //   const sType = scaleType({
        //     channel: 'x',
        //     type: 'quantitative',
        //     scale: {rangeStep: {enum: [undefined, 21]}}
        //   });
        //   assert.equal(sType, undefined);
        // });
        // it('should not return undefined if channel is x/y and scale.rangeStep is a wildcard that contain only number', () => {
        //   const sType = scaleType({
        //     channel: 'x',
        //     type: 'quantitative',
        //     scale: {rangeStep: {enum: [17, 21]}}
        //   });
        //   assert.notEqual(sType, undefined);
        // });
        it('should return undefined if timeUnit is a wildcard for a temporal field', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                timeUnit: '?',
                type: 'temporal'
            });
            chai_1.assert.equal(sType, undefined);
        });
        it('should return ScaleType.LINEAR if type is quantitative for x and scale type is not specified', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                type: TYPE.QUANTITATIVE
            });
            chai_1.assert.equal(sType, scale_1.ScaleType.LINEAR);
        });
        it('should return undefined if scale type is not specified, type is temporal, and TimeUnit is a Wildcard', () => {
            const sType = encoding_1.scaleType({
                channel: wildcard_1.SHORT_WILDCARD,
                timeUnit: wildcard_1.SHORT_WILDCARD,
                type: TYPE.TEMPORAL
            });
            chai_1.assert.equal(sType, undefined);
        });
        it('should return ScaleType.TIME if type is temporal and scale type and TimeUnit are not specified', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                type: TYPE.TEMPORAL
            });
            chai_1.assert.equal(sType, scale_1.ScaleType.TIME);
        });
        TIMEUNITS.forEach(timeUnit => {
            it('should return ScaleType.TIME if type is temporal and has timeUnit', () => {
                const sType = encoding_1.scaleType({
                    channel: 'x',
                    timeUnit: timeUnit,
                    type: TYPE.TEMPORAL
                });
                chai_1.assert.equal(sType, scale_1.ScaleType.TIME);
            });
        });
        it('should return ScaleType.TIME if type is temporal, TimeUnit is undefined, and scale type is not defined', () => {
            const sType = encoding_1.scaleType({
                channel: 'x',
                type: TYPE.TEMPORAL
            });
            chai_1.assert.equal(sType, scale_1.ScaleType.TIME);
        });
    });
});
//# sourceMappingURL=encoding.test.js.map