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
const config_1 = require("../src/config");
const model_1 = require("../src/model");
const stylize_1 = require("../src/stylize");
const fixture_1 = require("./fixture");
describe('stylize', () => {
    describe('smallRangeStepForHighCardinalityOrFacet', () => {
        it('should not assign a rangeStep of 12 if cardinality of Y is under 10', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                encodings: [{ channel: CHANNEL.Y, field: 'O', scale: {}, type: TYPE.ORDINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height, undefined);
        });
        it('should not assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                height: { step: 21 },
                encodings: [{ channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height.step, 21);
        });
        it('should assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is not already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                encodings: [{ channel: CHANNEL.Y, field: 'O_100', scale: {}, type: TYPE.ORDINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height.step, 12);
        });
        it('should not assign a rangeStep of 12 if there is a row channel and rangeStep is already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                height: { step: 21 },
                encodings: [
                    { channel: CHANNEL.Y, field: 'A', type: TYPE.ORDINAL },
                    { channel: CHANNEL.ROW, field: 'A', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height.step, 21);
        });
        it('should assign a rangeStep of 12 if there is a row channel and rangeStep is not already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                encodings: [
                    { channel: CHANNEL.Y, field: 'A', scale: {}, type: TYPE.ORDINAL },
                    { channel: CHANNEL.ROW, field: 'A', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height.step, 12);
        });
        it('should not assign a rangeStep if scale is false', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                encodings: [{ channel: CHANNEL.Y, field: 'O_100', scale: false, type: TYPE.ORDINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height, undefined);
        });
        it('should assign a rangeStep if scale is an Wildcard', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                encodings: [
                    { channel: CHANNEL.Y, field: 'O_100', scale: { name: 'scale', enum: [true, false] }, type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.specQuery.height.step, 12);
        });
        it('should not assign a rangeStep if rangeStep is a Wildcard', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.BAR,
                height: { name: 'step', enum: [{ step: 17 }, { step: 21 }] },
                encodings: [
                    {
                        channel: CHANNEL.Y,
                        field: 'O_100',
                        type: TYPE.ORDINAL
                    }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.smallRangeStepForHighCardinalityOrFacet(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.specQuery.height, {
                name: 'step',
                enum: [{ step: 17 }, { step: 21 }]
            });
        });
    });
    describe('nominalColorScaleForHighCardinality', () => {
        it('should not assign a range of category20 if cardinality of color is under 10', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.COLOR, field: 'N', scale: {}, type: TYPE.NOMINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.range, undefined);
        });
        it('should not assign a range of category20 if cardinality of color is over 10 and range is already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.COLOR, field: 'N20', scale: { range: [10, 20] }, type: TYPE.NOMINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.range, [
                10,
                20
            ]);
        });
        it('should assign a range of category20 if cardinality of color is over 10 and range is not already set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.COLOR, field: 'N20', scale: {}, type: TYPE.NOMINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.scheme, 'category20');
        });
        it('should not assign a range if cardinality of color is over 10 and scale is false', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.COLOR, field: 'N20', scale: false, type: TYPE.NOMINAL }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.range, undefined);
        });
        it('should assign a scheme if cardinality of color is over 10 and scale is a Wildcard', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.COLOR, field: 'N20', scale: { name: 'scale', enum: [true, false] }, type: TYPE.NOMINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.scheme, 'category20');
        });
        it('should not assign a range if cardinality of color is over 10 and scale.range is wildcard', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.COLOR,
                        field: 'N20',
                        scale: { range: { name: 'scaleRange', enum: [null] } },
                        type: TYPE.NOMINAL
                    }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.nominalColorScaleForHighCardinality(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.COLOR).scale.range, {
                name: 'scaleRange',
                enum: [null]
            });
        });
    });
    describe('xAxisOnTopForHighYCardinalityWithoutColumn', () => {
        it('should not orient the x axis on top if there is column channel', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.COLUMN, field: 'A', type: TYPE.ORDINAL },
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.NOMINAL, axis: {} },
                    { channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, undefined);
        });
        it('should not orient the x axis on top if the orient has already been set', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: { orient: 'bottom' } },
                    { channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, 'bottom');
        });
        it('should not orient the x axis on top if axis is set to false', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: false },
                    { channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, undefined);
        });
        it("should not orient the x axis on top if the Y channel's type is not NOMINAL or ORDINAL", () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: {} },
                    { channel: CHANNEL.Y, field: 'Q2', type: TYPE.QUANTITATIVE }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, undefined);
        });
        it('should not orient the x axis on top if there is no Y channel', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'Q2', type: TYPE.QUANTITATIVE, axis: {} }]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, undefined);
        });
        it('should not orient the x axis on top if the cardinality of the Y channel is not sufficiently high', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: {} },
                    { channel: CHANNEL.Y, field: 'O', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.deepEqual(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, undefined);
        });
        it('should orient the x axis on top if there is no column channel and the cardinality of the Y channel is sufficiently high', () => {
            let specM = model_1.SpecQueryModel.build({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL }
                ]
            }, fixture_1.schema, config_1.DEFAULT_QUERY_CONFIG);
            specM = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn(specM, fixture_1.schema, {}, config_1.DEFAULT_QUERY_CONFIG);
            chai_1.assert.equal(specM.getEncodingQueryByChannel(CHANNEL.X).axis.orient, 'top');
        });
    });
});
//# sourceMappingURL=stylize.test.js.map