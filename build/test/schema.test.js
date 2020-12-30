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
const TYPE = __importStar(require("vega-lite/build/src/type"));
const config_1 = require("../src/config");
const schema_1 = require("../src/schema");
const util_1 = require("../src/util");
describe('schema', () => {
    describe('build', () => {
        it('should correctly create a Schema object with empty data', () => {
            const data = [];
            let schema = schema_1.build(data);
            chai_1.assert.isNotNull(schema);
            chai_1.assert.equal(schema.fieldNames().length, 0);
        });
        it('should store FieldSchemas in the correct order', () => {
            const data = [{ a: '1/1/2000', c: 'abc', d: 1, b: 1 }];
            let schema = schema_1.build(data);
            chai_1.assert.equal(schema['fieldSchemas'][0]['name'], 'c');
            chai_1.assert.equal(schema['fieldSchemas'][1]['name'], 'a');
            chai_1.assert.equal(schema['fieldSchemas'][2]['name'], 'b');
            chai_1.assert.equal(schema['fieldSchemas'][3]['name'], 'd');
        });
    });
    const data = [{ a: 1, b: 'a', c: 1.1, d: '1/1/2010' }, { a: 2, b: 'b', c: 1.1, d: '1/1/2010' }];
    const schema = schema_1.build(data);
    describe('fields', () => {
        it('should return an array of the correct fields', () => {
            const fields = schema.fieldNames();
            chai_1.assert.equal(fields.length, 4);
            chai_1.assert.notEqual(fields.indexOf('a'), -1);
            chai_1.assert.notEqual(fields.indexOf('b'), -1);
            chai_1.assert.notEqual(fields.indexOf('c'), -1);
            chai_1.assert.notEqual(fields.indexOf('d'), -1);
        });
    });
    describe('type', () => {
        it('should return the expected primitive type of each field', () => {
            chai_1.assert.equal(schema.primitiveType('a'), schema_1.PrimitiveType.INTEGER);
            chai_1.assert.equal(schema.primitiveType('b'), schema_1.PrimitiveType.STRING);
            chai_1.assert.equal(schema.primitiveType('c'), schema_1.PrimitiveType.NUMBER);
            chai_1.assert.equal(schema.primitiveType('d'), schema_1.PrimitiveType.DATETIME);
        });
    });
    describe('vlType', () => {
        let configWithOrdinalInference = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, {
            numberOrdinalProportion: 0.05,
            numberOrdinalLimit: 50
        });
        it('should return the correct type of measurement for each field', () => {
            chai_1.assert.equal(schema.vlType('a'), TYPE.QUANTITATIVE);
            chai_1.assert.equal(schema.vlType('b'), TYPE.NOMINAL);
            chai_1.assert.equal(schema.vlType('c'), TYPE.QUANTITATIVE);
            chai_1.assert.equal(schema.vlType('d'), TYPE.TEMPORAL);
        });
        it('should infer quantitative type for integers when cardinality is much less than the total but distinct is high', () => {
            const numberData = [];
            // add enough non-distinct data to make the field nominal
            let total = 1 / configWithOrdinalInference.numberOrdinalProportion + 1;
            for (let i = 0; i < total * configWithOrdinalInference.numberOrdinalLimit; i++) {
                numberData.push({ a: 1 });
            }
            // add enough distinct data to go over numberOrdinalLimit
            for (let i = 0; i < configWithOrdinalInference.numberOrdinalLimit + 1; i++) {
                numberData.push({ a: i });
            }
            const numberSchema = schema_1.build(numberData, configWithOrdinalInference);
            chai_1.assert.equal(numberSchema.vlType('a'), TYPE.QUANTITATIVE);
        });
        it('should infer nominal type for integers when cardinality is much less than the total', () => {
            const numberData = [];
            // add enough non-distinct data to make the field nominal
            let total = 1 / configWithOrdinalInference.numberOrdinalProportion + 1;
            for (let i = 0; i < total; i++) {
                numberData.push({ a: 1 });
            }
            const numberSchema = schema_1.build(numberData, configWithOrdinalInference);
            chai_1.assert.equal(numberSchema.vlType('a'), TYPE.NOMINAL);
        });
        it('should infer nominal type for 0, 1, 2 integers when cardinality is much less than the total', () => {
            const numberData = [];
            // add enough non-distinct data to make the field nominal/ordinal and have multiple in-order, non-skipping values that starts at 0
            // (and by default, we set them to nominal)
            let total = 3 * (1 / configWithOrdinalInference.numberOrdinalProportion + 1);
            for (let i = 0; i < total; i++) {
                numberData.push({ a: 0 });
                numberData.push({ a: 1 });
                numberData.push({ a: 2 });
            }
            const numberSchema = schema_1.build(numberData, configWithOrdinalInference);
            chai_1.assert.equal(numberSchema.vlType('a'), TYPE.NOMINAL);
        });
        it('should infer nominal type for 1, 2, 3 integers when cardinality is much less than the total', () => {
            const numberData = [];
            // add enough non-distinct data to make the field nominal/ordinal and have multiple in-order, non-skipping values that starts at 1
            // (and by default, we set them to nominal)
            let total = 3 * (1 / configWithOrdinalInference.numberOrdinalProportion + 1);
            for (let i = 0; i < total; i++) {
                numberData.push({ a: 1 });
                numberData.push({ a: 2 });
                numberData.push({ a: 3 });
            }
            const numberSchema = schema_1.build(numberData, configWithOrdinalInference);
            chai_1.assert.equal(numberSchema.vlType('a'), TYPE.NOMINAL);
        });
    });
    describe('cardinality', () => {
        it('should return the correct cardinality for each field', () => {
            chai_1.assert.equal(schema.cardinality({ field: 'a', channel: CHANNEL.X }), 2);
            chai_1.assert.equal(schema.cardinality({ field: 'b', channel: CHANNEL.X }), 2);
            chai_1.assert.equal(schema.cardinality({ field: 'c', channel: CHANNEL.X }), 1);
            chai_1.assert.equal(schema.cardinality({ field: 'd', channel: CHANNEL.X }), 1);
        });
        it('should return the correct cardinality for a binned field when default bin parameters are specified', () => {
            const cardinalityData = [{ a: 0 }, { a: 10 }]; // min/max
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: true // should cause maxbins to be 10
            });
            chai_1.assert.equal(cardinality, 10);
        });
        it('should correctly return binned cardinality when specific bin parameters are specified', () => {
            const cardinalityData = [{ a: 0 }, { a: 5 }]; // min/max
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: {
                    maxbins: 5
                }
            });
            chai_1.assert.equal(cardinality, 5);
        });
        it('should correctly compute new binned cardinality when bin params are not already cached', () => {
            const cardinalityData = [{ a: 0 }, { a: 7 }]; // min/max
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: {
                    maxbins: 7
                }
            });
            chai_1.assert.equal(cardinality, 7);
        });
        it('should correctly compute new binned cardinality when binned cardinality is less than non-binned cardinality', () => {
            const cardinalityData = [
                { a: 0 },
                { a: 1 },
                { a: 2 },
                { a: 2 },
                { a: 3 },
                { a: 3 },
                // bin 4-5 (empty)
                { a: 6 },
                { a: 7 } // bin 6-7
            ];
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinalityNoBin = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X
            });
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: {
                    maxbins: 4
                }
            });
            chai_1.assert.equal(cardinalityNoBin, 6);
            chai_1.assert.equal(cardinality, 4);
        });
        it('should correctly compute cardinality for single timeUnits with domain augmenting set to true', () => {
            const cardinalityData = [{ a: '1/1/2016' }];
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'month'
            });
            chai_1.assert.equal(cardinality, 12);
        });
        it('should correctly compute cardinality for single timeUnits with domain augmenting set to false', () => {
            const cardinalityData = [{ a: '1/1/2016' }, { a: '2/1/2016' }, { a: '2/1/2016' }];
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'month'
            }, false);
            chai_1.assert.equal(cardinality, 2);
        });
        it('should correctly compute cardinality for multiple timeUnits when relevant timeUnits are the same and irrelevant timeUnits are different', () => {
            const cardinalityData = [];
            for (let i = 1; i <= 30; i++) {
                cardinalityData.push({
                    a: `June ${i}, 2000`
                });
            }
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearmonth'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 1);
        });
        it('should correctly compute cardinality for multiple timeUnits when there are not duplicate dates', () => {
            const numYears = 5;
            const cardinalityData = [];
            for (let i = 1; i <= numYears; i++) {
                cardinalityData.push({
                    a: `June ${i}, 200${i}`
                });
            }
            const cardinalitySchema = schema_1.build(cardinalityData);
            const cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearmonth'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, numYears);
        });
        it('should correctly compute cardinality for `yearquarter` timeunit', () => {
            let cardinalityData = [{ a: 'June 21, 1996' }, { a: 'January 21, 1996' }];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearquarter'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 2);
            cardinalityData = [{ a: 'June 21, 1996' }, { a: 'May 21, 1996' }];
            cardinalitySchema = schema_1.build(cardinalityData);
            cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearquarter'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 1);
        });
        it('should correctly compute cardinality for `year` timeunit', () => {
            let cardinalityData = [{ a: 'June 21, 2000' }, { a: 'June 21, 2000' }];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'year'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 1);
            cardinalityData = [{ a: 'June 21, 2000' }, { a: 'June 21, 2010' }];
            cardinalitySchema = schema_1.build(cardinalityData);
            cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'year'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 2);
        });
        it('should correctly compute cardinality for `quartermonth` timeunit', () => {
            // should be the same as the 'month' cardinality
            let cardinalityData = [{ a: 'June 1, 2000' }, { a: 'May  1, 2000' }, { a: 'May  1, 2000' }, { a: 'January  1, 2000' }];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'quartermonth'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 3);
        });
        it('should correctly compute cardinality for `hoursminutes` timeunit', () => {
            // should be the same as the 'month' cardinality
            let cardinalityData = [
                { a: 'June 1, 2000 00:00:00' },
                { a: 'June 1, 2000 01:01:00' },
                { a: 'May 15, 2000 01:01:00' },
                { a: 'June 1, 2000 01:02:00' }
            ];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'hoursminutes'
            });
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 3);
        });
        it('should correctly compute cardinality for TEMPORAL data when the excludeValid flag is specified', () => {
            let cardinalityData = [
                { a: 'June 1, 2000 00:00:00' },
                { a: 'June 1, 2000 00:00:00' },
                { a: null },
                { a: null },
                { a: NaN },
                { a: NaN }
            ];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'year'
            }, true, true);
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.DATETIME);
            chai_1.assert.equal(cardinality, 1);
            cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'year'
            }, true, false);
            chai_1.assert.equal(cardinality, 3);
        });
        it('should correctly compute cardinality for QUANTITATIVE data when the excludeValid flag is specified', () => {
            let cardinalityData = [{ a: 1 }, { a: 1 }, { a: null }, { a: null }, { a: NaN }, { a: NaN }];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X
            }, true, true);
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.INTEGER);
            chai_1.assert.equal(cardinality, 1);
            cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X
            }, true, false);
            chai_1.assert.equal(cardinality, 3);
        });
        it('should correctly compute cardinality for QUANTITATIVE binned data when the excludeValid flag is specified', () => {
            let cardinalityData = [{ a: 0 }, { a: 10 }, { a: null }, { a: null }, { a: NaN }, { a: NaN }];
            let cardinalitySchema = schema_1.build(cardinalityData);
            let cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: true
            }, true, true);
            chai_1.assert.equal(cardinalitySchema.primitiveType('a'), schema_1.PrimitiveType.INTEGER);
            chai_1.assert.equal(cardinality, 10);
            cardinality = cardinalitySchema.cardinality({
                field: 'a',
                channel: CHANNEL.X,
                bin: true
            }, true, false);
            chai_1.assert.equal(cardinality, 10); // invalid values shouldn't affect cardinality for linear-binned fields
        });
    });
    describe('timeUnitHasVariation', () => {
        it('should return true when all parts of a specified multi-timeUnit have at least 2 distinct values', () => {
            const variationData = [{ a: 'Jan 1, 2000' }, { a: 'Feb 1, 2001' }];
            const variationSchema = schema_1.build(variationData);
            chai_1.assert.isTrue(variationSchema.timeUnitHasVariation({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearmonth'
            }));
        });
        it('should return false when at least 1 part of a multi-part timeUnit does not have at least 2 distinct values', () => {
            const variationData = [{ a: 'Jan 1, 2000' }, { a: 'Jan 1, 2001' }];
            const variationSchema = schema_1.build(variationData);
            chai_1.assert.isFalse(variationSchema.timeUnitHasVariation({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'yearmonth'
            }));
        });
        it('should return false when date has no variation but day does have variation and the `day` unit is used', () => {
            const variationData = [
                { a: 'Jan 1, 2000' },
                { a: 'Feb 1, 2000' } // tuesday
            ];
            const variationSchema = schema_1.build(variationData);
            chai_1.assert.isFalse(variationSchema.timeUnitHasVariation({
                field: 'a',
                channel: CHANNEL.X,
                timeUnit: 'day'
            }));
        });
        it('should return undefined when timeUnit is undefined', () => {
            const variationData = [];
            const variationSchema = schema_1.build(variationData);
            chai_1.assert.isUndefined(variationSchema.timeUnitHasVariation({
                field: 'a',
                channel: CHANNEL.X
            }));
        });
    });
    describe('stats', () => {
        it('should return null for an EncodingQuery whose field does not exist in the schema', () => {
            const summary = schema.stats({ field: 'foo', channel: CHANNEL.X });
            chai_1.assert.isNull(summary);
        });
        it('should return the correct summary for a valid EncodingQuery', () => {
            const summary = schema.stats({ field: 'a', channel: CHANNEL.X });
            chai_1.assert.isNotNull(summary);
            chai_1.assert.equal(summary.count, 2);
            chai_1.assert.equal(summary.distinct, 2);
            chai_1.assert.equal(summary.min, 1);
            chai_1.assert.equal(summary.max, 2);
        });
    });
    describe('domain', () => {
        const domainData = [
            { a: 1, b: 1.1, c: 'a', d: 'a', e: 'July 14 2016' },
            { a: 2, b: 1.2, c: 'b', d: 'a', e: '7/14/2016' },
            { a: 3, b: 1.3, c: 'c', d: 'b', e: '6/14/2016' },
            { a: 4, b: 1.4, c: 'd', d: 'b', e: '6-14-2016' }
        ];
        const domainSchema = schema_1.build(domainData);
        it('should return an array containing one of each datapoint corresponding to the given EncodingQuery for non-Q data', () => {
            const domain = domainSchema.domain({ field: 'c' });
            chai_1.assert.isNotNull(domain);
            chai_1.assert.equal(domain.length, 4);
            chai_1.assert.notEqual(domain.indexOf('a'), -1);
            chai_1.assert.notEqual(domain.indexOf('b'), -1);
            chai_1.assert.notEqual(domain.indexOf('c'), -1);
            chai_1.assert.notEqual(domain.indexOf('d'), -1);
        });
        it('should only return one copy of datapoints that occur multiple times', () => {
            const domain = domainSchema.domain({ field: 'd' });
            chai_1.assert.equal(domain.length, 2);
            chai_1.assert.notEqual(domain.indexOf('a'), -1);
            chai_1.assert.notEqual(domain.indexOf('b'), -1);
        });
        it('should return an array of length 2 containing min and max for quantitative data', () => {
            let domain = domainSchema.domain({ field: 'a' });
            chai_1.assert.equal(domain.length, 2);
            chai_1.assert.equal(domain.indexOf(1), 0);
            chai_1.assert.equal(domain.indexOf(4), 1);
            domain = domainSchema.domain({ field: 'b' });
            chai_1.assert.equal(domain.length, 2);
            chai_1.assert.equal(domain.indexOf(1.1), 0);
            chai_1.assert.equal(domain.indexOf(1.4), 1);
        });
        it('should return a date array containing correctly translated date types', () => {
            let domain = domainSchema.domain({ field: 'e' });
            chai_1.assert.equal(domain.length, 2);
            chai_1.assert.equal(domain[0].getTime(), new Date('6/14/2016').getTime());
            chai_1.assert.equal(domain[1].getTime(), new Date('7/14/2016').getTime());
        });
    });
    describe('dataTable', () => {
        const dataTableData = [
            { a: 1, b: 1.1, c: 'a', d: 2.3 },
            { a: 2, b: 1.2, c: 'b', d: 3.4 },
            { a: 3, b: 1.3, c: 'c', d: 6.0 },
            { a: 4, b: 1.4, c: 'd', d: 7.2 }
        ];
        const dataTable = {
            fields: [
                { name: 'a', type: schema_1.PrimitiveType.INTEGER, title: 'a title', custom: 'la la la' },
                { name: 'b', type: schema_1.PrimitiveType.INTEGER }
            ],
            primaryKey: 'a'
        };
        // build schema with passed in dataTable schema
        let dataTableSchema = schema_1.build(dataTableData, {}, dataTable);
        it('should have data table schema values override inferred values', () => {
            chai_1.assert.equal(dataTableSchema.primitiveType('b'), schema_1.PrimitiveType.INTEGER);
            // assert that a similar data type would get a different inferred primitive type
            chai_1.assert.equal(dataTableSchema.primitiveType('d'), schema_1.PrimitiveType.NUMBER);
        });
        it('should retain custom values in fields', () => {
            const rTableSchema = dataTableSchema.tableSchema();
            // open question: should tableSchema() only return original schema-ed fields?
            // shouldn't be an issue usually, as a valid table schema will include
            // all fields in the data.
            chai_1.assert.equal(rTableSchema.fields.length, 4);
            chai_1.assert.equal(rTableSchema.fields[0].title, 'a title');
            chai_1.assert.equal(rTableSchema.fields[0].custom, 'la la la');
        });
        it('should retain data table schema level attributes passed in', () => {
            const rTableSchema = dataTableSchema.tableSchema();
            chai_1.assert.equal(rTableSchema.primaryKey, 'a');
        });
    });
});
//# sourceMappingURL=schema.test.js.map