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
const config_1 = require("../src/config");
const property_1 = require("../src/property");
const wildcard_1 = require("../src/wildcard");
describe('wildcard', () => {
    describe('isWildcard', () => {
        it('should return true for a wildcard with name and values', () => {
            chai_1.assert(wildcard_1.isWildcard({
                name: 'a',
                enum: [1, 2, 3]
            }));
        });
        it('should return true for a wildcard with name.', () => {
            chai_1.assert(wildcard_1.isWildcard({
                name: 'a'
            }));
        });
        it('should return true for a wildcard with values', () => {
            chai_1.assert(wildcard_1.isWildcard({
                enum: [1, 2, 3]
            }));
        });
        it('should return true for a short wildcard', () => {
            chai_1.assert(wildcard_1.isWildcard(wildcard_1.SHORT_WILDCARD));
        });
        it('should return false for a string', () => {
            chai_1.assert(!wildcard_1.isWildcard('string'));
        });
        it('should return false for a number', () => {
            chai_1.assert(!wildcard_1.isWildcard(9));
        });
        it('should return false for a boolean value', () => {
            chai_1.assert(!wildcard_1.isWildcard(true));
        });
        it('should return false for an array', () => {
            chai_1.assert(!wildcard_1.isWildcard([1, 2]));
        });
    });
    describe('initWildcard', () => {
        it('should not extend the wildcard with SHORT_WILDCARD.', () => {
            const mark = wildcard_1.initWildcard(wildcard_1.SHORT_WILDCARD, 'm', [MARK.POINT]);
            chai_1.assert.deepEqual(mark, {
                name: 'm',
                enum: [MARK.POINT]
            });
        });
        it('should return full wildcard with other properties preserved', () => {
            const binQuery = wildcard_1.initWildcard({ enum: [true, false], maxbins: 30 }, 'b1', [true, false]);
            chai_1.assert.deepEqual(binQuery.enum, [true, false]);
            chai_1.assert.equal(binQuery['maxbins'], 30);
            chai_1.assert.equal(binQuery.name, 'b1');
        });
    });
    describe('getDefaultName', () => {
        it('should return name for all properties and have no duplicate default names', () => {
            let defaultNameIndex = {};
            const missing = [];
            const duplicated = {};
            for (let prop of property_1.DEFAULT_PROP_PRECEDENCE) {
                const name = wildcard_1.getDefaultName(prop);
                if (name === undefined) {
                    missing.push(property_1.toKey(prop));
                }
                else {
                    if (name in defaultNameIndex) {
                        duplicated[defaultNameIndex[name]] = duplicated[defaultNameIndex[name]] || [];
                        duplicated[defaultNameIndex[name]].push(property_1.toKey(prop));
                    }
                }
                chai_1.assert.equal(name in defaultNameIndex, false, `${name} is already used for ${JSON.stringify(defaultNameIndex[name])} and thus can't be used for ${JSON.stringify(prop)}`);
                defaultNameIndex[wildcard_1.getDefaultName(prop)] = prop;
            }
            chai_1.assert.equal(missing.length, 0, `Properties with missing name: ${missing.join(',')}`);
            chai_1.assert.equal(Object.keys(duplicated).length, 0, `Properties with duplicate names: ${JSON.stringify(duplicated)}`);
        });
        it('should return enum for every properties by default', () => {
            const missing = [];
            const mockSchema = {
                fieldNames: () => ['a', 'b']
            };
            for (const prop of property_1.DEFAULT_PROP_PRECEDENCE) {
                const e = wildcard_1.getDefaultEnumValues(prop, mockSchema, config_1.DEFAULT_QUERY_CONFIG);
                if (e === undefined) {
                    missing.push(property_1.toKey(prop));
                }
            }
            chai_1.assert.equal(missing.length, 0, `Properties with missing enum: ${missing.join(',')}`);
        });
    });
    describe('getDefaultEnumValues', () => {
        it('should return enum for every properties by default.', () => {
            const missing = [];
            const mockSchema = {
                fieldNames: () => ['a', 'b']
            };
            for (const prop of property_1.DEFAULT_PROP_PRECEDENCE) {
                const e = wildcard_1.getDefaultEnumValues(prop, mockSchema, config_1.DEFAULT_QUERY_CONFIG);
                if (e === undefined) {
                    missing.push(property_1.toKey(prop));
                }
            }
            chai_1.assert.equal(missing.length, 0, `Properties with missing enum: ${missing.join(',')}`);
        });
    });
});
//# sourceMappingURL=wildcard.test.js.map