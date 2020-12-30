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
const generate_1 = require("../src/generate");
const nest_1 = require("../src/nest");
const property_1 = require("../src/property");
const groupby_1 = require("../src/query/groupby");
const util_1 = require("../src/util");
const wildcard_1 = require("../src/wildcard");
const fixture_1 = require("./fixture");
describe('nest', () => {
    describe('group by properties', () => {
        describe('field ignoring function', () => {
            it('should group visualization with same fields', () => {
                const query = {
                    spec: {
                        mark: wildcard_1.SHORT_WILDCARD,
                        encodings: [
                            {
                                channel: wildcard_1.SHORT_WILDCARD,
                                field: 'Q',
                                type: TYPE.QUANTITATIVE,
                                aggregate: {
                                    name: 'a0',
                                    enum: ['mean', 'median']
                                }
                            },
                            {
                                channel: wildcard_1.SHORT_WILDCARD,
                                field: 'O',
                                type: TYPE.ORDINAL
                            }
                        ]
                    },
                    nest: [
                        {
                            groupBy: [{ property: property_1.Property.FIELD, replace: groupby_1.REPLACE_BLANK_FIELDS }]
                        }
                    ],
                    config: config_1.DEFAULT_QUERY_CONFIG
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 1);
                chai_1.assert.equal(groups[0].name, 'O|Q');
            });
            it('should group histogram and raw plots in the same group', () => {
                const query = {
                    spec: {
                        mark: wildcard_1.SHORT_WILDCARD,
                        encodings: [
                            {
                                channel: wildcard_1.SHORT_WILDCARD,
                                field: 'Q',
                                type: TYPE.QUANTITATIVE,
                                bin: wildcard_1.SHORT_WILDCARD,
                                aggregate: wildcard_1.SHORT_WILDCARD
                            }
                        ]
                    },
                    nest: [
                        {
                            groupBy: [{ property: property_1.Property.FIELD, replace: groupby_1.REPLACE_BLANK_FIELDS }]
                        },
                        {
                            groupBy: [property_1.Property.AGGREGATE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.STACK]
                        }
                    ],
                    config: util_1.extend({ autoAddCount: true }, config_1.DEFAULT_QUERY_CONFIG)
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 1);
                chai_1.assert.equal(groups[0].name, 'Q');
                chai_1.assert.equal(groups[0].items.length, 3);
            });
            it('should group stacked and non-stacked plots of same fields in the same group', () => {
                const query = {
                    spec: {
                        mark: wildcard_1.SHORT_WILDCARD,
                        encodings: [
                            {
                                channel: wildcard_1.SHORT_WILDCARD,
                                field: 'N',
                                type: TYPE.NOMINAL
                            },
                            {
                                channel: wildcard_1.SHORT_WILDCARD,
                                field: 'N1',
                                type: TYPE.NOMINAL
                            }
                        ]
                    },
                    nest: [
                        {
                            groupBy: [{ property: property_1.Property.FIELD, replace: groupby_1.REPLACE_BLANK_FIELDS }]
                        }
                    ],
                    config: util_1.extend({ autoAddCount: true }, config_1.DEFAULT_QUERY_CONFIG)
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 1);
                chai_1.assert.equal(groups[0].name, 'N|N1');
            });
        });
    });
    describe('field, aggregate, bin, timeUnit', () => {
        it('should group visualization with same fields and transformations', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE,
                            aggregate: {
                                name: 'a0',
                                enum: ['mean', 'median']
                            }
                        },
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK
                        ]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            // two because have two different aggregation
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'O,o|mean(Q,q)');
            chai_1.assert.equal(groups[1].name, 'O,o|median(Q,q)');
        });
    });
    describe('field, aggregate, bin, timeUnit, channel, type', () => {
        it('should group visualizations with different retinal variables if has proper replace', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SIZE] },
                            field: 'Q2',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK,
                            { property: property_1.Property.CHANNEL, replace: groupby_1.REPLACE_MARK_STYLE_CHANNELS }
                        ]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should group visualizations with different retinal variables', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SHAPE] },
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK,
                            { property: property_1.Property.CHANNEL, replace: groupby_1.REPLACE_MARK_STYLE_CHANNELS }
                        ]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should group visualizations with different retinal variables or transposed', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SIZE] },
                            field: 'Q2',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK,
                            { property: property_1.Property.CHANNEL, replace: util_1.extend({}, groupby_1.REPLACE_XY_CHANNELS, groupby_1.REPLACE_MARK_STYLE_CHANNELS) }
                        ]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should separate different types of stacked and non-stacked visualizations', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: 'sum',
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'N',
                            type: TYPE.NOMINAL
                        },
                        {
                            channel: CHANNEL.COLOR,
                            field: 'N1',
                            type: TYPE.NOMINAL
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK,
                            {
                                property: property_1.Property.CHANNEL,
                                replace: util_1.extend({}, groupby_1.REPLACE_XY_CHANNELS, groupby_1.REPLACE_FACET_CHANNELS, groupby_1.REPLACE_MARK_STYLE_CHANNELS)
                            }
                        ]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
            groups[0].items.forEach((item) => {
                return !util_1.contains([MARK.BAR, MARK.AREA], item.getMark());
            });
            chai_1.assert.equal(groups[1].name, 'style:N1,n|xy:N,n|xy:sum(Q,q,stack="zero")');
            groups[1].items.forEach((item) => {
                return util_1.contains([MARK.BAR, MARK.AREA], item.getMark());
            });
        });
        it('should separate different types of stacked and non-stacked visualizations even if it is nested ', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: 'sum',
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'N',
                            type: TYPE.NOMINAL
                        },
                        {
                            channel: CHANNEL.COLOR,
                            field: 'N1',
                            type: TYPE.NOMINAL
                        }
                    ]
                },
                nest: [
                    {
                        groupBy: [
                            property_1.Property.FIELD,
                            property_1.Property.TYPE,
                            property_1.Property.AGGREGATE,
                            property_1.Property.BIN,
                            property_1.Property.TIMEUNIT,
                            property_1.Property.STACK,
                            {
                                property: property_1.Property.CHANNEL,
                                replace: util_1.extend({}, groupby_1.REPLACE_XY_CHANNELS, groupby_1.REPLACE_FACET_CHANNELS, groupby_1.REPLACE_MARK_STYLE_CHANNELS)
                            }
                        ]
                    },
                    {
                        groupBy: [{ property: property_1.Property.CHANNEL, replace: util_1.extend({}, groupby_1.REPLACE_MARK_STYLE_CHANNELS) }]
                    }
                ],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
            groups[0].items.forEach((item) => {
                return !util_1.contains([MARK.BAR, MARK.AREA], item.items[0].getMark());
            });
            chai_1.assert.equal(groups[1].name, 'style:N1,n|xy:N,n|xy:sum(Q,q,stack="zero")');
            groups[1].items.forEach((item) => {
                return util_1.contains([MARK.BAR, MARK.AREA], item.items[0].getMark());
            });
        });
    });
    describe('field', () => {
        it('should group visualization with same fields', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE,
                            aggregate: {
                                name: 'a0',
                                enum: ['mean', 'median']
                            }
                        },
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.FIELD }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            // two because have two different aggregation
            chai_1.assert.equal(groups.length, 1);
            chai_1.assert.equal(groups[0].name, 'O|Q');
        });
        it('should group histogram and raw plots in the same group', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE,
                            bin: wildcard_1.SHORT_WILDCARD,
                            aggregate: wildcard_1.SHORT_WILDCARD
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.FIELD }, { groupBy: nest_1.FIELD_TRANSFORM }],
                config: util_1.extend({ autoAddCount: true }, config_1.DEFAULT_QUERY_CONFIG)
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            // two because have two different aggregation
            chai_1.assert.equal(groups.length, 1);
            chai_1.assert.equal(groups[0].name, 'Q');
            chai_1.assert.equal(groups[0].items.length, 3);
        });
    });
    describe('fieldTransform', () => {
        it('should group visualization with same fields and transformations', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE,
                            aggregate: {
                                name: 'a0',
                                enum: ['mean', 'median']
                            }
                        },
                        {
                            channel: wildcard_1.SHORT_WILDCARD,
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.FIELD_TRANSFORM }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            // two because have two different aggregation
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'O,o|mean(Q,q)');
            chai_1.assert.equal(groups[1].name, 'O,o|median(Q,q)');
        });
    });
    describe('encoding', () => {
        it('should group visualizations with different retinal variables', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SIZE] },
                            field: 'Q2',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should group visualizations with different retinal variables', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SHAPE] },
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should group visualizations with different retinal variables or transposed', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q1',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: { enum: [CHANNEL.COLOR, CHANNEL.SIZE] },
                            field: 'Q2',
                            type: TYPE.QUANTITATIVE
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 1);
        });
        it('should separate different types of stacked and non-stacked visualizations', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: 'sum',
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'N',
                            type: TYPE.NOMINAL
                        },
                        {
                            channel: CHANNEL.COLOR,
                            field: 'N1',
                            type: TYPE.NOMINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
            groups[0].items.forEach((item) => {
                return !util_1.contains([MARK.BAR, MARK.AREA], item.getMark());
            });
            chai_1.assert.equal(groups[1].name, 'style:N1,n|xy:N,n|xy:sum(Q,q,stack="zero")');
            groups[1].items.forEach((item) => {
                return util_1.contains([MARK.BAR, MARK.AREA], item.getMark());
            });
        });
        it('should separate different types of stacked and non-stacked visualizations even if it is nested ', () => {
            const query = {
                spec: {
                    mark: wildcard_1.SHORT_WILDCARD,
                    encodings: [
                        {
                            channel: CHANNEL.X,
                            aggregate: 'sum',
                            field: 'Q',
                            type: TYPE.QUANTITATIVE
                        },
                        {
                            channel: CHANNEL.Y,
                            field: 'N',
                            type: TYPE.NOMINAL
                        },
                        {
                            channel: CHANNEL.COLOR,
                            field: 'N1',
                            type: TYPE.NOMINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
            chai_1.assert.equal(groups[1].name, 'style:N1,n|xy:N,n|xy:sum(Q,q,stack="zero")');
        });
    });
    describe('encoding', () => {
        [nest_1.ENCODING].forEach(groupBy => {
            it(`${groupBy} should group transposed visualizations`, () => {
                const query = {
                    spec: {
                        mark: wildcard_1.SHORT_WILDCARD,
                        encodings: [
                            {
                                channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                                field: 'Q',
                                type: TYPE.QUANTITATIVE
                            },
                            {
                                channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                                field: 'Q2',
                                type: TYPE.QUANTITATIVE
                            }
                        ]
                    },
                    nest: [{ groupBy: nest_1.ENCODING }],
                    config: config_1.DEFAULT_QUERY_CONFIG
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 1);
            });
            it(`${groupBy} should group transposed facets visualizations`, () => {
                const query = {
                    spec: {
                        mark: wildcard_1.SHORT_WILDCARD,
                        encodings: [
                            {
                                channel: CHANNEL.X,
                                field: 'Q',
                                type: TYPE.QUANTITATIVE
                            },
                            {
                                channel: CHANNEL.Y,
                                field: 'Q1',
                                type: TYPE.QUANTITATIVE
                            },
                            {
                                channel: { enum: [CHANNEL.ROW, CHANNEL.COLUMN] },
                                field: 'O',
                                type: TYPE.ORDINAL
                            },
                            {
                                channel: { enum: [CHANNEL.ROW, CHANNEL.COLUMN] },
                                field: 'N',
                                type: TYPE.NOMINAL
                            }
                        ]
                    },
                    nest: [{ groupBy: groupBy }],
                    config: config_1.DEFAULT_QUERY_CONFIG
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 1);
            });
            it(`${groupBy} should not group visualizations that map same variable to y and color`, () => {
                const query = {
                    spec: {
                        mark: MARK.POINT,
                        encodings: [
                            {
                                channel: CHANNEL.X,
                                field: 'Q',
                                type: TYPE.QUANTITATIVE
                            },
                            {
                                channel: { enum: [CHANNEL.Y, CHANNEL.COLOR] },
                                field: 'Q1',
                                type: TYPE.QUANTITATIVE
                            }
                        ]
                    },
                    nest: [{ groupBy: groupBy }],
                    config: util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, { omitNonPositionalOrFacetOverPositionalChannels: false })
                };
                const answerSet = generate_1.generate(query.spec, fixture_1.schema, query.config);
                const groups = nest_1.nest(answerSet, query.nest).items;
                chai_1.assert.equal(groups.length, 2);
            });
        });
    });
    describe('fieldTransform, encoding', () => {
        it('should group visualization with same fields and transformations, then by encoding', () => {
            const query = {
                spec: {
                    mark: MARK.POINT,
                    encodings: [
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'Q',
                            type: TYPE.QUANTITATIVE,
                            aggregate: {
                                name: 'a0',
                                enum: ['mean', 'median']
                            }
                        },
                        {
                            channel: { enum: [CHANNEL.X, CHANNEL.Y] },
                            field: 'O',
                            type: TYPE.ORDINAL
                        }
                    ]
                },
                nest: [{ groupBy: nest_1.FIELD_TRANSFORM }, { groupBy: nest_1.ENCODING }],
                config: config_1.DEFAULT_QUERY_CONFIG
            };
            const answerSet = generate_1.generate(query.spec, fixture_1.schema);
            const groups = nest_1.nest(answerSet, query.nest).items;
            // two because have two different aggregation
            chai_1.assert.equal(groups.length, 2);
            chai_1.assert.equal(groups[0].name, 'O,o|mean(Q,q)');
            chai_1.assert.equal(groups[1].name, 'O,o|median(Q,q)');
            chai_1.assert.equal(groups[0].items.length, 1);
            chai_1.assert.equal(groups[0].items[0].name, 'xy:O,o|xy:mean(Q,q)');
            chai_1.assert.equal(groups[1].items.length, 1);
            chai_1.assert.equal(groups[1].items[0].name, 'xy:O,o|xy:median(Q,q)');
        });
    });
});
//# sourceMappingURL=nest.test.js.map