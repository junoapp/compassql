"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const property_1 = require("../../src/property");
const groupby_1 = require("../../src/query/groupby");
describe('query/groupby', () => {
    describe('parse', () => {
        it('should return correct include and replacer for GROUP_BY_ENCODING', () => {
            const parsed = groupby_1.parseGroupBy(groupby_1.GROUP_BY_ENCODING);
            chai_1.assert.deepEqual(parsed.include['index'], {
                field: true,
                type: true,
                aggregate: true,
                bin: true,
                timeUnit: true,
                stack: true,
                channel: true
            });
            chai_1.assert.isTrue(parsed.replacer.has('channel'));
        });
    });
    describe('isExtendedGroupBy', () => {
        it('should return true for extended groupBy', () => {
            chai_1.assert(groupby_1.isExtendedGroupBy({ property: property_1.Property.CHANNEL }));
            chai_1.assert(groupby_1.isExtendedGroupBy({ property: property_1.Property.CHANNEL, replace: { x: 'xy', y: 'xy' } }));
        });
        it('should return false for normal groupBy', () => {
            chai_1.assert(!groupby_1.isExtendedGroupBy(property_1.Property.CHANNEL));
        });
    });
    describe('toString', () => {
        it('should return correct string for groupBy properties (array)', () => {
            chai_1.assert.equal(groupby_1.toString([
                property_1.Property.FIELD,
                { property: property_1.Property.AGGREGATE },
                {
                    property: property_1.Property.CHANNEL,
                    replace: groupby_1.REPLACE_MARK_STYLE_CHANNELS
                }
            ]), 'field,aggregate,channel[color,opacity,shape,size=>style]');
        });
        it('should return correct string for string groupBy', () => {
            chai_1.assert.equal(groupby_1.toString('foobar'), 'foobar');
        });
    });
});
//# sourceMappingURL=groupby.test.js.map