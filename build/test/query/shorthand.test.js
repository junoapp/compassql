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
const scale_1 = require("vega-lite/build/src/scale");
const vegaTime = __importStar(require("vega-time"));
const TYPE = __importStar(require("vega-lite/build/src/type"));
const propindex_1 = require("../../src/propindex");
const groupby_1 = require("../../src/query/groupby");
const shorthand_1 = require("../../src/query/shorthand");
const wildcard_1 = require("../../src/wildcard");
describe('query/shorthand', () => {
    describe('vlSpec', () => {
        it('should return a proper short hand string for a vega-lite spec', () => {
            chai_1.assert.equal(shorthand_1.vlSpec({
                transform: [{ filter: 'datum.x === 5' }, { calculate: 'datum.x*2', as: 'x2' }],
                mark: MARK.POINT,
                encoding: {
                    x: { field: 'x', type: TYPE.QUANTITATIVE }
                }
            }), 'point|transform:[{"filter":"datum.x === 5"},{"calculate":"datum.x*2","as":"x2"}]|x:x,q');
        });
    });
    describe('splitWithTail', () => {
        it('should correctly split a string', () => {
            let result = shorthand_1.splitWithTail('012-345-678-9', '-', 2);
            chai_1.assert.deepEqual(result, ['012', '345', '678-9']);
        });
        it('should correctly split a string when `count` is greater than the number of delimiters in the string', () => {
            let result = shorthand_1.splitWithTail('012-345', '-', 3);
            chai_1.assert.deepEqual(result, ['012', '345', '', '']);
        });
    });
    describe('parse', () => {
        it('should correctly parse a shorthand string with calculate, filter, and filterInvalid', () => {
            let specQ = shorthand_1.parse('point|transform:[{"calculate":"3*datum[\\"b2\\"]", "as": "b2"},{"filter":"datum[\\"b2\\"] > 60"}]|x:b2,q|y:bin(balance,q)');
            chai_1.assert.deepEqual(specQ, {
                transform: [{ calculate: '3*datum["b2"]', as: 'b2' }, { filter: 'datum["b2"] > 60' }],
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'b2', type: TYPE.QUANTITATIVE },
                    { bin: {}, channel: CHANNEL.Y, field: 'balance', type: TYPE.QUANTITATIVE }
                ]
            });
        });
        it('should correctly parse an ambiguous shorthand with aggregate, bin as wildcard, and with hasFn', () => {
            let specQ = shorthand_1.parse('?|?:?{"aggregate":"?","bin":"?","hasFn":true}(?,?)');
            chai_1.assert.equal(specQ.mark, '?');
            chai_1.assert.deepEqual(specQ.encodings[0], {
                aggregate: '?',
                bin: '?',
                channel: '?',
                field: '?',
                hasFn: true,
                type: '?'
            });
        });
        it('should correctly parse an ambiguous shorthand with aggregate and bin as wildcard', () => {
            let specQ = shorthand_1.parse('?|?:?{"aggregate":["max","min"],"bin":[false,true],"hasFn":true}(?,?)');
            chai_1.assert.equal(specQ.mark, '?');
            chai_1.assert.deepEqual(specQ.encodings[0], {
                aggregate: { enum: ['max', 'min'] },
                bin: { enum: [false, true] },
                channel: '?',
                field: '?',
                hasFn: true,
                type: '?'
            });
        });
    });
    describe('shorthandParser', () => {
        describe('encoding', () => {
            it('should correctly parse an encoding query given a channel and fieldDefShorthand', () => {
                const encQ = shorthand_1.shorthandParser.encoding('x', 'bin(a,q,maxbins=20,scale={"type":"linear"})');
                chai_1.assert.deepEqual(encQ, {
                    bin: { maxbins: 20 },
                    channel: CHANNEL.X,
                    field: 'a',
                    type: TYPE.QUANTITATIVE,
                    scale: { type: scale_1.ScaleType.LINEAR }
                });
            });
        });
        describe('fn', () => {
            it('should correctly parse an encoding query given a fieldDefShorthand with aggregation function', () => {
                const encQ = shorthand_1.shorthandParser.fn('sum(horsepower,q)');
                chai_1.assert.deepEqual(encQ, { aggregate: 'sum', field: 'horsepower', type: TYPE.QUANTITATIVE });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with count function', () => {
                const encQ = shorthand_1.shorthandParser.fn('count(*,q)');
                chai_1.assert.deepEqual(encQ, { aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with timeunit function', () => {
                const encQ = shorthand_1.shorthandParser.fn('hours(a,t)');
                chai_1.assert.deepEqual(encQ, { field: 'a', timeUnit: vegaTime.HOURS, type: TYPE.TEMPORAL });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with maxbins bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,maxbins=20)');
                chai_1.assert.deepEqual(encQ, {
                    bin: { maxbins: 20 },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with bin extent', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,extent=[20,20])');
                chai_1.assert.deepEqual(encQ, {
                    bin: { extent: [20, 20] },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with base bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,base=20)');
                chai_1.assert.deepEqual(encQ, {
                    bin: { base: 20 },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with step bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,step=20)');
                chai_1.assert.deepEqual(encQ, {
                    bin: { step: 20 },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with steps bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,steps=[2,5])');
                chai_1.assert.deepEqual(encQ, {
                    bin: { steps: [2, 5] },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with minstep bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,step=20)');
                chai_1.assert.deepEqual(encQ, {
                    bin: { step: 20 },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query given a fieldDefShorthand with div bin function', () => {
                const encQ = shorthand_1.shorthandParser.fn('bin(a,q,divide=[5,2])');
                chai_1.assert.deepEqual(encQ, {
                    bin: { divide: [5, 2] },
                    field: 'a',
                    type: TYPE.QUANTITATIVE
                });
            });
        });
        describe('rawFieldDef', () => {
            it('should correctly parse an encoding query from fieldDef parts', () => {
                let encQ = shorthand_1.shorthandParser.rawFieldDef(shorthand_1.splitWithTail('a,q,scale={"domain":[1,2],"exponent":3,"type":"pow"},axis={"orient":"top"}', ',', 2));
                chai_1.assert.deepEqual(encQ, {
                    axis: { orient: 'top' },
                    field: 'a',
                    scale: { domain: [1, 2], exponent: 3, type: scale_1.ScaleType.POW },
                    type: TYPE.QUANTITATIVE
                });
            });
            it('should correctly parse an encoding query from fieldDef parts', () => {
                let encQ = shorthand_1.shorthandParser.rawFieldDef(shorthand_1.splitWithTail('a,n,sort={"field":"a","op":"mean","order":"descending"}', ',', 2));
                chai_1.assert.deepEqual(encQ, { field: 'a', sort: { field: 'a', op: 'mean', order: 'descending' }, type: TYPE.NOMINAL });
            });
        });
    });
    describe('spec', () => {
        it('should return correct spec string for specific specQuery', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }]
            });
            chai_1.assert.equal(str, 'point|x:a,q');
        });
        it('should exclude autoCount:false mapping', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, autoCount: false, type: TYPE.QUANTITATIVE }
                ]
            });
            chai_1.assert.equal(str, 'point|x:a,q');
        });
        it('should return correct spec string for specific specQuery with channel replacer', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    { channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.COLOR, field: 'b', type: TYPE.QUANTITATIVE }
                ]
            }, shorthand_1.INCLUDE_ALL, new propindex_1.PropIndex({
                channel: (channel) => {
                    if (channel === CHANNEL.X || channel === CHANNEL.Y) {
                        return 'xy';
                    }
                    return channel;
                }
            }));
            chai_1.assert.equal(str, 'point|color:b,q|xy:a,q');
        });
        it('should return correct spec string for specific specQuery when mark is not included.', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }]
            }, new propindex_1.PropIndex({ channel: true, field: true, type: true }));
            chai_1.assert.equal(str, 'x:a,q');
        });
        it('should return correct spec string for a histogram with autoCount=true when groupBy field with blank replacer.', () => {
            const str = shorthand_1.spec({
                mark: MARK.BAR,
                encodings: [
                    { channel: CHANNEL.X, bin: true, field: 'a', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, autoCount: true, type: TYPE.QUANTITATIVE }
                ]
            }, new propindex_1.PropIndex({ field: true }), new propindex_1.PropIndex({
                // replacer
                field: shorthand_1.getReplacer(groupby_1.REPLACE_BLANK_FIELDS)
            }));
            chai_1.assert.equal(str, 'a|autocount()');
        });
        it('should return correct spec string for ambiguous mark, channel, field, and type', () => {
            const str = shorthand_1.spec({
                mark: { enum: [MARK.POINT, MARK.TICK] },
                encodings: [
                    {
                        channel: { name: 'c1', enum: [CHANNEL.X, CHANNEL.Y] },
                        field: { enum: ['field1', 'field2'] },
                        type: { enum: [TYPE.NOMINAL, TYPE.ORDINAL] },
                        aggregate: wildcard_1.SHORT_WILDCARD,
                        bin: wildcard_1.SHORT_WILDCARD
                    }
                ]
            });
            chai_1.assert.equal(str, '?["point","tick"]|?["x","y"]:?{"aggregate":"?","bin":"?"}(?["field1","field2"],?["nominal","ordinal"])');
        });
        it('should return correct spec string for ambiguous specQuery', () => {
            const str = shorthand_1.spec({
                mark: wildcard_1.SHORT_WILDCARD,
                encodings: [
                    {
                        channel: wildcard_1.SHORT_WILDCARD,
                        field: wildcard_1.SHORT_WILDCARD,
                        type: wildcard_1.SHORT_WILDCARD,
                        aggregate: wildcard_1.SHORT_WILDCARD,
                        bin: wildcard_1.SHORT_WILDCARD
                    }
                ]
            });
            chai_1.assert.equal(str, '?|?:?{"aggregate":"?","bin":"?"}(?,?)');
        });
        it('should return correct spec string for a specific specQuery with transform filter and calculate', () => {
            const str = shorthand_1.spec({
                transform: [{ calculate: '3*datum["b2"]', as: 'b2' }, { filter: 'datum["b2"] > 60' }],
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'b2', type: TYPE.QUANTITATIVE }]
            });
            chai_1.assert.equal(str, 'point|transform:[{"calculate":"3*datum[\\"b2\\"]","as":"b2"},{"filter":"datum[\\"b2\\"] > 60"}]|x:b2,q');
        });
        it('should return correct spec string for a specific specQuery with transform filter and calculate', () => {
            const str = shorthand_1.spec({
                transform: [
                    { filter: { field: 'color', equal: 'red' } },
                    { filter: 'datum["b2"] > 60' },
                    { filter: { field: 'color', oneOf: ['red', 'yellow'] } },
                    { filter: { field: 'x', range: [0, 5] } }
                ],
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'b2', type: TYPE.QUANTITATIVE }]
            });
            chai_1.assert.deepEqual(str, 'point|transform:[' +
                '{"filter":{"field":"color","equal":"red"}},' +
                '{"filter":"datum[\\"b2\\"] > 60"},' +
                '{"filter":{"field":"color","oneOf":["red","yellow"]}},' +
                '{"filter":{"field":"x","range":[0,5]}}]' +
                '|x:b2,q');
        });
        it('should return correct spec string for a specific specQuery with an empty transform', () => {
            const str = shorthand_1.spec({
                transform: [],
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }]
            });
            chai_1.assert.equal(str, 'point|x:a,q');
        });
    });
    describe('stack', () => {
        it('should include stack for stacked specQuery by default', () => {
            const str = shorthand_1.spec({
                mark: MARK.BAR,
                encodings: [
                    { channel: CHANNEL.X, field: 'q', type: TYPE.QUANTITATIVE, aggregate: 'sum' },
                    { channel: CHANNEL.Y, field: 'n', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'n1', type: TYPE.NOMINAL }
                ]
            });
            chai_1.assert.equal(str, 'bar|color:n1,n|x:sum(q,q,stack="zero")|y:n,n');
        });
        it('should exclude stack for stacked specQuery if we exclude it', () => {
            const str = shorthand_1.spec({
                mark: MARK.BAR,
                encodings: [
                    { channel: CHANNEL.X, field: 'q', type: TYPE.QUANTITATIVE, aggregate: 'sum' },
                    { channel: CHANNEL.Y, field: 'n', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'n1', type: TYPE.NOMINAL }
                ]
            }, shorthand_1.INCLUDE_ALL.duplicate().set('stack', false));
            chai_1.assert.equal(str, 'bar|color:n1,n|x:sum(q,q)|y:n,n');
        });
    });
    describe('encoding', () => {
        it('should return correct encoding string for raw field', () => {
            const str = shorthand_1.encoding({ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE });
            chai_1.assert.equal(str, 'x:a,q');
        });
        it('should return correct encoding string for channel as short wildcard', () => {
            const str = shorthand_1.encoding({ channel: '?', field: 'a', type: TYPE.QUANTITATIVE });
            chai_1.assert.equal(str, '?:a,q');
        });
        it('should return correct encoding string for bin with maxbins as wildcard and channel as wildcard', () => {
            const str = shorthand_1.encoding({
                bin: { maxbins: { enum: [10, 20] } },
                channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                field: 'a',
                type: TYPE.QUANTITATIVE
            });
            chai_1.assert.equal(str, '?["x","y"]:bin(a,q,maxbins=?[10,20])');
        });
        it('should return correct encoding string for raw field when channel is not included', () => {
            const str = shorthand_1.encoding({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE
            }, new propindex_1.PropIndex({
                field: true,
                type: true
            }));
            chai_1.assert.equal(str, 'a,q');
        });
    });
    describe('fieldDef', () => {
        it('should return - for disabled autocount field', () => {
            const str = shorthand_1.fieldDef({ channel: CHANNEL.X, autoCount: false });
            chai_1.assert.equal(str, '-');
        });
        it('should return correct fieldDefShorthand string for raw field', () => {
            const str = shorthand_1.fieldDef({ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE });
            chai_1.assert.equal(str, 'a,q');
        });
        it('should return correct fieldDefShorthand string for raw field when nothing is included', () => {
            const str = shorthand_1.fieldDef({ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }, new propindex_1.PropIndex());
            chai_1.assert.equal(str, '...');
        });
        it('should return correct fieldDefShorthand string for aggregate field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                aggregate: 'mean'
            });
            chai_1.assert.equal(str, 'mean(a,q)');
        });
        it('should not include aggregate string for aggregate field when aggregate is not included', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                aggregate: 'mean'
            }, new propindex_1.PropIndex({ field: true, type: true }));
            chai_1.assert.equal(str, 'a,q');
        });
        it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                aggregate: wildcard_1.SHORT_WILDCARD,
                bin: wildcard_1.SHORT_WILDCARD
            });
            chai_1.assert.equal(str, '?{"aggregate":"?","bin":"?"}(a,q)');
        });
        it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                aggregate: { name: 'a1', enum: ['max', 'min'] },
                bin: { enum: [false, true], maxbins: 20 }
            });
            chai_1.assert.equal(str, '?{"aggregate":["max","min"],"bin":[false,true]}(a,q,maxbins=20)');
        });
        it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                aggregate: { name: 'a1', enum: [undefined, 'min'] },
                bin: { enum: [false, true], maxbins: 20 },
                hasFn: true
            });
            chai_1.assert.equal(str, '?{"aggregate":[null,"min"],"bin":[false,true],"hasFn":true}(a,q,maxbins=20)');
        });
        it('should return correct fieldDefShorthand string for timeunit field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.TEMPORAL,
                timeUnit: vegaTime.HOURS
            });
            chai_1.assert.equal(str, 'hours(a,t)');
        });
        it('should return correct fieldDefShorthand string for ambiguous timeunit field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                timeUnit: wildcard_1.SHORT_WILDCARD
            });
            chai_1.assert.equal(str, '?{"timeUnit":"?"}(a,q)');
        });
        it('should return correct fieldDefShorthand string for sort with ascending', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                sort: 'ascending'
            });
            chai_1.assert.equal(str, 'a,q,sort="ascending"');
        });
        it('should return correct fieldDefShorthand string for sort field definition object', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                sort: { field: 'a', op: 'mean', order: 'descending' }
            });
            chai_1.assert.equal(str, 'a,q,sort={"field":"a","op":"mean","order":"descending"}');
        });
        it('should return correct fieldDefShorthand string for bin with maxbins, and scale with scaleType ', () => {
            const str = shorthand_1.fieldDef({
                bin: { maxbins: 20 },
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { type: scale_1.ScaleType.LINEAR }
            });
            chai_1.assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"})');
        });
        it('should return correct fieldDefShorthand string for scale with scaleType point and sort field definition object', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.Y,
                field: 'a',
                type: TYPE.ORDINAL,
                scale: { type: scale_1.ScaleType.POINT },
                sort: { field: 'b', op: 'mean' }
            });
            chai_1.assert.equal(str, 'a,o,scale={"type":"point"},sort={"field":"b","op":"mean"}');
        });
        it('should return correct fieldDefShorthand string for bin with maxbins, axis with orient, scale with scaleType ', () => {
            const str = shorthand_1.fieldDef({
                axis: { orient: 'top' },
                bin: { maxbins: 20 },
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { type: scale_1.ScaleType.LINEAR }
            });
            chai_1.assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"},axis={"orient":"top"})');
        });
        it('should return correct fieldDefShorthand string for axis with orient, shortTimeLabels, ticks, and title', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.X,
                        field: 'a',
                        type: TYPE.QUANTITATIVE,
                        axis: { orient: 'top', tickCount: 5, title: 'test x channel' }
                    }
                ]
            });
            chai_1.assert.equal(str, 'point|x:a,q,axis={"orient":"top","tickCount":5,"title":"test x channel"}');
        });
        it('should return correct fieldDefShorthand string for legend with properties ordered alphabetically', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: CHANNEL.COLOR,
                        field: 'a',
                        type: TYPE.NOMINAL,
                        legend: { title: 'test title', orient: 'right' }
                    }
                ]
            });
            chai_1.assert.equal(str, 'point|color:a,n,legend={"orient":"right","title":"test title"}');
        });
        it('should return a fieldDefShorthand string without incorrect legend', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    {
                        axis: { orient: 'right' },
                        channel: CHANNEL.X,
                        field: 'a',
                        type: TYPE.NOMINAL,
                        legend: { orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title' }
                    }
                ]
            });
            chai_1.assert.equal(str, 'point|x:a,n,axis={"orient":"right"}');
        });
        it('should return a fieldDefShorthand string without incorrect axis', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [
                    {
                        axis: { orient: 'right' },
                        channel: CHANNEL.COLOR,
                        field: 'a',
                        type: TYPE.NOMINAL,
                        legend: {
                            zindex: 0
                        }
                    }
                ]
            });
            chai_1.assert.equal(str, 'point|color:a,n,legend={"zindex":0}');
        });
        it('should return correct fieldDefShorthand string for scale with a string[] domain', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.NOMINAL,
                scale: { domain: ['cats', 'dogs'] }
            });
            chai_1.assert.equal(str, 'a,n,scale={"domain":["cats","dogs"]}');
        });
        it('should return correct fieldDefShorthand string for scale with a number[] domain', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.NOMINAL,
                scale: { domain: [1, 2] }
            });
            chai_1.assert.equal(str, 'a,n,scale={"domain":[1,2]}');
        });
        it('should return correct fieldDefShorthand string for scale with a string[] range', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.NOMINAL,
                scale: { range: ['cats', 'dogs'] }
            });
            chai_1.assert.equal(str, 'a,n,scale={"range":["cats","dogs"]}');
        });
        it('should return correct fieldDefShorthand string for scale with a number[] range', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.NOMINAL,
                scale: { range: [1, 2] }
            });
            chai_1.assert.equal(str, 'a,n,scale={"range":[1,2]}');
        });
        it('should return correct fieldDefShorthand string for bin field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: true
            });
            chai_1.assert.equal(str, 'bin(a,q)');
        });
        it('should return correct fieldDefShorthand string for bin field with maxbins', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { maxbins: 20 }
            });
            chai_1.assert.equal(str, 'bin(a,q,maxbins=20)');
        });
        it('should return correct fieldDefShorthand string for bin field with min', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { extent: [0, 20] }
            });
            chai_1.assert.equal(str, 'bin(a,q,extent=[0,20])');
        });
        it('should return correct fieldDefShorthand string for bin field with base', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { base: 20 }
            });
            chai_1.assert.equal(str, 'bin(a,q,base=20)');
        });
        it('should return correct fieldDefShorthand string for bin field with step', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { step: 20 }
            });
            chai_1.assert.equal(str, 'bin(a,q,step=20)');
        });
        it('should return correct fieldDefShorthand string for bin field with steps', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { steps: [2, 5] }
            });
            chai_1.assert.equal(str, 'bin(a,q,steps=[2,5])');
        });
        it('should return correct fieldDefShorthand string for bin field with minstep', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { minstep: 20 }
            });
            chai_1.assert.equal(str, 'bin(a,q,minstep=20)');
        });
        it('should return correct fieldDefShorthand string for bin field with divide', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { divide: [5, 2] }
            });
            chai_1.assert.equal(str, 'bin(a,q,divide=[5,2])');
        });
        it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType linear', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { maxbins: 20 },
                scale: { type: scale_1.ScaleType.LINEAR }
            });
            chai_1.assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"})');
        });
        it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType linear when only field, bin, and type are included', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: { maxbins: 20 },
                scale: { type: scale_1.ScaleType.LINEAR }
            }, new propindex_1.PropIndex({ field: true, bin: true, type: true }));
            chai_1.assert.equal(str, 'bin(a,q)');
        });
        it('should return correct fieldDefShorthand string for disabled scale', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: null
            });
            chai_1.assert.equal(str, 'a,q,scale=false');
        });
        it('should return correct fieldDefShorthand string for disabled scale', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: false
            });
            chai_1.assert.equal(str, 'a,q,scale=false');
        });
        it('should return correct fieldDefShorthand string for empty scale definition', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: {}
            });
            chai_1.assert.equal(str, 'a,q');
        });
        it('should return correct fieldDefShorthand string for scale with scaleType log', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { type: scale_1.ScaleType.LOG }
            });
            chai_1.assert.equal(str, 'a,q,scale={"type":"log"}');
        });
        it('should return correct fieldDef string for scale with clamp=true', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { clamp: true }
            });
            chai_1.assert.equal(str, 'a,q,scale={"clamp":true}');
        });
        it('should return correct fieldDef string for scale with round=true', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { round: true }
            });
            chai_1.assert.equal(str, 'a,q,scale={"round":true}');
        });
        it('should return correct fieldDef string for scale with exponent of 3 and supported scaleType', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { type: scale_1.ScaleType.POW, exponent: 3 }
            });
            chai_1.assert.equal(str, 'a,q,scale={"exponent":3,"type":"pow"}');
        });
        it('should return correct fieldDef string for scale with nice=true', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { nice: true }
            });
            chai_1.assert.equal(str, 'a,q,scale={"nice":true}');
        });
        it('should return correct fieldDef string for scale with round=true', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { round: true }
            });
            chai_1.assert.equal(str, 'a,q,scale={"round":true}');
        });
        it('should return correct fieldDef string for scale with zero=true', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                scale: { zero: true }
            });
            chai_1.assert.equal(str, 'a,q,scale={"zero":true}');
        });
        // TODO: Update tests for other scale.*
        it('should return correct fieldDefShorthand string for ambiguous bin field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: TYPE.QUANTITATIVE,
                bin: wildcard_1.SHORT_WILDCARD
            });
            chai_1.assert.equal(str, '?{"bin":"?"}(a,q)');
        });
        it('should return correct fieldDefShorthand string for ambiguous field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: wildcard_1.SHORT_WILDCARD,
                type: TYPE.QUANTITATIVE
            });
            chai_1.assert.equal(str, '?,q');
        });
        it('should return correct fieldDefShorthand string for autocount field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                autoCount: true
            });
            chai_1.assert.equal(str, 'count(*,q)');
        });
        it('should return correct fieldDefShorthand string for ambiguous autocount field', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                autoCount: wildcard_1.SHORT_WILDCARD
            });
            chai_1.assert.equal(str, '?{"autoCount":"?"}(*,q)');
        });
        it('should return correct fieldDefShorthand string for ambiguous type', () => {
            const str = shorthand_1.fieldDef({
                channel: CHANNEL.X,
                field: 'a',
                type: wildcard_1.SHORT_WILDCARD
            });
            chai_1.assert.equal(str, 'a,?');
        });
    });
    describe('width and height', () => {
        it('should return correct shorthand string for width in a SpecQuery', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }],
                width: 1440
            });
            chai_1.assert.equal(str, 'point|x:a,q|width=1440');
        });
        it('should return correct shorthand string for height in a SpecQuery', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }],
                height: 1080
            });
            chai_1.assert.equal(str, 'point|x:a,q|height=1080');
        });
        it('should return correct shorthand string for width and height in a SpecQuery', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }],
                width: 1440,
                height: 1080
            });
            chai_1.assert.equal(str, 'point|x:a,q|width=1440|height=1080');
        });
        it('should omit width and height from shorthand string if they are not in include', () => {
            const str = shorthand_1.spec({
                mark: MARK.POINT,
                encodings: [{ channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE }],
                width: 1440,
                height: 1080
            }, shorthand_1.INCLUDE_ALL.duplicate()
                .set('width', false)
                .set('height', false));
            chai_1.assert.equal(str, 'point|x:a,q');
        });
    });
});
//# sourceMappingURL=shorthand.test.js.map