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
const MARK = __importStar(require("vega-lite/build/src/mark"));
const property_1 = require("../src/property");
const wildcardindex_1 = require("../src/wildcardindex");
describe('wildcardindex', () => {
    describe('isEmpty', () => {
        it('should return false if encoding property is set', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex().setEncodingProperty(0, property_1.Property.SCALE, {
                name: 'scale',
                enum: [true, false]
            });
            chai_1.assert.equal(wildcardIndex.isEmpty(), false);
        });
        it('should return false if mark is set', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex().setMark({ name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE] });
            chai_1.assert.equal(wildcardIndex.isEmpty(), false);
        });
        it('should return false if mark and encoding property are set', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex()
                .setEncodingProperty(0, property_1.Property.SCALE, { name: 'scale', enum: [true, false] })
                .setMark({ name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE] });
            chai_1.assert.equal(wildcardIndex.isEmpty(), false);
        });
        it('should return true if mark and encoding property are not set', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex();
            chai_1.assert.equal(wildcardIndex.isEmpty(), true);
        });
    });
    describe('hasProperty', () => {
        it('should return true if encodingIndicesByProperty contains a specified encoding property', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex().setEncodingProperty(0, property_1.Property.SCALE, {
                name: 'scale',
                enum: [true, false]
            });
            chai_1.assert.equal(wildcardIndex.hasProperty(property_1.Property.SCALE), true);
        });
        it('should return false if encodingIndicesByProperty does not contain a specified encoding property', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex();
            chai_1.assert.equal(wildcardIndex.hasProperty(property_1.Property.SCALE), false);
        });
        it('should return true if wildcardIndex contains Property.MARK when Property.MARK is specified', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex().setMark({ name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE] });
            chai_1.assert.equal(wildcardIndex.hasProperty(property_1.Property.MARK), true);
        });
        it('should return false if wildcardIndex does not contain Property.MARK when Property.MARK is specified', () => {
            let wildcardIndex = new wildcardindex_1.WildcardIndex();
            chai_1.assert.equal(wildcardIndex.hasProperty(property_1.Property.MARK), false);
        });
    });
});
//# sourceMappingURL=wildcardindex.test.js.map