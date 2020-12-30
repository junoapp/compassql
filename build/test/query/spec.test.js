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
const mark_1 = require("vega-lite/build/src/mark");
const stack_1 = require("vega-lite/build/src/stack");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const spec_1 = require("../../src/query/spec");
const util_1 = require("../../src/util");
const wildcard_1 = require("../../src/wildcard");
describe('query/spec', () => {
    describe('getStackOffset', () => {
        it('should return the stack offset specified', () => {
            wildcard_1.DEFAULT_ENUM_INDEX.stack.forEach((stackOffset) => {
                const specQ = {
                    mark: 'bar',
                    encodings: [
                        { channel: CHANNEL.X, aggregate: 'sum', stack: stackOffset, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.equal(spec_1.getStackOffset(specQ), stackOffset);
            });
        });
    });
    describe('getStackChannel', () => {
        it('should return the channel in which stack is specified', () => {
            wildcard_1.DEFAULT_ENUM_INDEX.stack.forEach((stackOffset) => {
                const specStackInX = {
                    mark: 'bar',
                    encodings: [
                        { channel: CHANNEL.X, aggregate: 'sum', stack: stackOffset, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.equal(spec_1.getStackChannel(specStackInX), CHANNEL.X);
                const specStackInY = {
                    mark: 'bar',
                    encodings: [
                        { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', stack: stackOffset, type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.equal(spec_1.getStackChannel(specStackInY), CHANNEL.Y);
                const specStackInColor = {
                    mark: 'bar',
                    encodings: [
                        { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', stack: stackOffset, type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.equal(spec_1.getStackChannel(specStackInColor), CHANNEL.COLOR);
            });
        });
    });
    describe('getVlStack', () => {
        const NON_STACKABLE_MARKS = util_1.without(mark_1.PRIMITIVE_MARKS, Array.from(stack_1.STACKABLE_MARKS.values()));
        const NON_STACK_BY_DEFAULT_MARKS = util_1.without(mark_1.PRIMITIVE_MARKS, Array.from(stack_1.STACK_BY_DEFAULT_MARKS.values()));
        it('should always return null for nonstackable marks with at least of of the stack channel', () => {
            [undefined, 'center', null, 'zero', 'normalize'].forEach((_stack) => {
                NON_STACKABLE_MARKS.forEach(nonStackableMark => {
                    const specQ = {
                        mark: nonStackableMark,
                        encodings: [
                            { channel: CHANNEL.X, aggregate: 'sum', stack: _stack, field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    chai_1.assert.isNull(spec_1.getVlStack(specQ));
                });
            });
        });
        it('should always return non-null for implicit stack by default marks', () => {
            stack_1.STACK_BY_DEFAULT_MARKS.forEach(mark => {
                const specQ = {
                    mark: mark,
                    encodings: [
                        { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.isNotNull(spec_1.getVlStack(specQ));
            });
        });
        it('should always return null for implicit stack on non stack by default marks', () => {
            NON_STACK_BY_DEFAULT_MARKS.forEach(mark => {
                const specQ = {
                    mark: mark,
                    encodings: [
                        { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.isNull(spec_1.getVlStack(specQ));
            });
        });
        it('should always return null if mark is a wildcard', () => {
            const specQ = {
                mark: '?',
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                ]
            };
            chai_1.assert.isNull(spec_1.getVlStack(specQ));
        });
        it('should return null if any encoding property is a wildcard', () => {
            let specQ = {
                mark: 'bar',
                encodings: [
                    { channel: '?', field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                ]
            };
            chai_1.assert.isNull(spec_1.getVlStack(specQ));
            specQ = {
                mark: 'bar',
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: '?', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                ]
            };
            chai_1.assert.isNull(spec_1.getVlStack(specQ));
            specQ = {
                mark: 'bar',
                encodings: [
                    { channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE },
                    { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                    { channel: CHANNEL.COLOR, field: 'N1', type: '?' }
                ]
            };
            chai_1.assert.isNull(spec_1.getVlStack(specQ));
        });
        it('should always return null if there is no grouping channel', () => {
            [undefined, 'center', null, 'zero', 'normalize'].forEach((_stack) => {
                mark_1.PRIMITIVE_MARKS.forEach(mark => {
                    const specQ = {
                        mark: mark,
                        encodings: [
                            { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL }
                        ]
                    };
                    chai_1.assert.isNull(spec_1.getVlStack(specQ));
                });
            });
        });
        it('should always be disabled if both x and y are aggregate', () => {
            mark_1.PRIMITIVE_MARKS.forEach(mark => {
                const specQ = {
                    mark: mark,
                    encodings: [
                        { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.isNull(spec_1.getVlStack(specQ));
            });
        });
        it('should always be disabled if neither x nor y is aggregate', () => {
            mark_1.PRIMITIVE_MARKS.forEach(mark => {
                const specQ = {
                    mark: mark,
                    encodings: [
                        { channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                        { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                    ]
                };
                chai_1.assert.isNull(spec_1.getVlStack(specQ));
            });
        });
        describe('getVlStack().groupbyChannel, .fieldChannel', () => {
            it('should be correct for horizontal', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    const _stack = spec_1.getVlStack(specQ);
                    chai_1.assert.equal(_stack.fieldChannel, CHANNEL.X);
                    chai_1.assert.equal(_stack.groupbyChannel, CHANNEL.Y);
                });
            });
            it('should be correct for horizontal (single)', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    const _stack = spec_1.getVlStack(specQ);
                    chai_1.assert.equal(_stack.fieldChannel, CHANNEL.X);
                    chai_1.assert.equal(_stack.groupbyChannel, null);
                });
            });
            it('should be correct for vertical', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    const _stack = spec_1.getVlStack(specQ);
                    chai_1.assert.equal(_stack.fieldChannel, CHANNEL.Y);
                    chai_1.assert.equal(_stack.groupbyChannel, CHANNEL.X);
                });
            });
            it('should be correct for vertical (single)', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    const _stack = spec_1.getVlStack(specQ);
                    chai_1.assert.equal(_stack.fieldChannel, CHANNEL.Y);
                    chai_1.assert.equal(_stack.groupbyChannel, null);
                });
            });
            it('should be correct for auto count', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.Y, autoCount: true, type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    const _stack = spec_1.getVlStack(specQ);
                    chai_1.assert.isNotNull(_stack);
                });
            });
        });
        describe('getVlStack().offset', () => {
            it('should return zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
                [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                    const specQ = {
                        mark: stackableMark,
                        encodings: [
                            { channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                            { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                            { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                        ]
                    };
                    chai_1.assert.equal(spec_1.getVlStack(specQ).offset, 'zero');
                });
            });
            it('should return the specified stack for stackable marks with at least one of the stack channel', () => {
                ['center', 'zero', 'normalize'].forEach((_stack) => {
                    [mark_1.BAR, mark_1.AREA].forEach(stackableMark => {
                        const specQ = {
                            mark: stackableMark,
                            encodings: [
                                { channel: CHANNEL.X, stack: _stack, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE },
                                { channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL },
                                { channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL }
                            ]
                        };
                        chai_1.assert.equal(spec_1.getVlStack(specQ).offset, _stack);
                    });
                });
            });
        });
    });
    describe('fromSpec', () => {
        it('should produce correct SpecQuery', () => {
            const specQ = spec_1.fromSpec({
                data: { values: [{ x: 1 }, { x: 2 }] },
                transform: [{ filter: 'datum.x ===2' }],
                mark: MARK.POINT,
                encoding: {
                    x: {
                        field: 'x',
                        type: TYPE.QUANTITATIVE,
                        axis: { orient: 'top', tickCount: 5, title: 'test x channel' }
                    },
                    y: {
                        field: 'x',
                        type: TYPE.QUANTITATIVE,
                        scale: null
                    },
                    color: {
                        field: 'n',
                        type: 'nominal',
                        legend: { orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title' }
                    }
                },
                config: {}
            });
            chai_1.assert.deepEqual(specQ, {
                data: { values: [{ x: 1 }, { x: 2 }] },
                transform: [{ filter: 'datum.x ===2' }],
                mark: MARK.POINT,
                encodings: [
                    {
                        channel: 'x',
                        field: 'x',
                        type: TYPE.QUANTITATIVE,
                        axis: { orient: 'top', tickCount: 5, title: 'test x channel' }
                    },
                    { channel: 'y', field: 'x', type: TYPE.QUANTITATIVE, scale: false },
                    {
                        channel: 'color',
                        field: 'n',
                        type: 'nominal',
                        legend: { orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title' }
                    }
                ],
                config: {}
            });
        });
        it('should produce correct SpecQuery with Sort', () => {
            const specQ = spec_1.fromSpec({
                data: { values: [{ x: 1 }, { x: 2 }] },
                transform: [{ filter: 'datum.x ===2' }],
                mark: MARK.POINT,
                encoding: {
                    x: { field: 'x', sort: 'ascending', type: TYPE.QUANTITATIVE },
                    y: { field: 'x', sort: { field: 'x', op: 'mean', order: 'ascending' }, type: TYPE.QUANTITATIVE, scale: null }
                },
                config: {}
            });
            chai_1.assert.deepEqual(specQ, {
                data: { values: [{ x: 1 }, { x: 2 }] },
                transform: [{ filter: 'datum.x ===2' }],
                mark: MARK.POINT,
                encodings: [
                    { channel: 'x', field: 'x', sort: 'ascending', type: TYPE.QUANTITATIVE },
                    {
                        channel: 'y',
                        field: 'x',
                        sort: { field: 'x', op: 'mean', order: 'ascending' },
                        type: TYPE.QUANTITATIVE,
                        scale: false
                    }
                ],
                config: {}
            });
        });
        it('should produce correct SpecQuery without data, transform, config', () => {
            const specQ = spec_1.fromSpec({
                mark: MARK.POINT,
                encoding: {
                    x: { field: 'x', type: TYPE.QUANTITATIVE },
                    y: { field: 'x', type: TYPE.QUANTITATIVE, scale: null }
                }
            });
            chai_1.assert.deepEqual(specQ, {
                mark: MARK.POINT,
                encodings: [
                    { channel: 'x', field: 'x', type: TYPE.QUANTITATIVE },
                    { channel: 'y', field: 'x', type: TYPE.QUANTITATIVE, scale: false }
                ]
            });
        });
    });
    describe('hasWildcard', () => {
        it('returns true if there is a wildcard mark', () => {
            chai_1.assert(spec_1.hasWildcard({
                mark: '?',
                encodings: []
            }));
        });
        it('returns true if there is a wildcard encoding top-level property', () => {
            chai_1.assert(spec_1.hasWildcard({
                mark: 'point',
                encodings: [
                    {
                        channel: '?',
                        field: 'x',
                        type: 'quantitative'
                    }
                ]
            }));
        });
        it('returns true if there is a wildcard encoding nested property', () => {
            chai_1.assert(spec_1.hasWildcard({
                mark: 'point',
                encodings: [
                    {
                        channel: 'x',
                        scale: {
                            type: '?'
                        },
                        field: 'x',
                        type: 'quantitative'
                    }
                ]
            }));
        });
        it('returns false if there is no wildcard', () => {
            chai_1.assert(!spec_1.hasWildcard({
                mark: 'point',
                encodings: [
                    {
                        channel: 'x',
                        bin: {
                            maxbins: 20
                        },
                        field: 'x',
                        type: 'quantitative'
                    }
                ]
            }));
        });
        it('returns false if all wildcard are excluded', () => {
            chai_1.assert(!spec_1.hasWildcard({
                mark: '?',
                encodings: [
                    {
                        channel: 'x',
                        bin: {
                            maxbins: 20
                        },
                        field: 'x',
                        type: 'quantitative'
                    }
                ]
            }, { exclude: ['mark'] }));
        });
    });
});
//# sourceMappingURL=spec.test.js.map