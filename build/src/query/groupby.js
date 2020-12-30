"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM = exports.toString = exports.parseGroupBy = exports.isExtendedGroupBy = exports.REPLACE_MARK_STYLE_CHANNELS = exports.REPLACE_FACET_CHANNELS = exports.REPLACE_XY_CHANNELS = exports.REPLACE_BLANK_FIELDS = void 0;
const util_1 = require("datalib/src/util");
const shorthand_1 = require("./shorthand");
const property_1 = require("../property");
const propindex_1 = require("../propindex");
const util_2 = require("../util");
exports.REPLACE_BLANK_FIELDS = { '*': '' };
exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
function isExtendedGroupBy(g) {
    return util_1.isObject(g) && !!g['property'];
}
exports.isExtendedGroupBy = isExtendedGroupBy;
function parseGroupBy(groupBy, include, replaceIndex) {
    include = include || new propindex_1.PropIndex();
    replaceIndex = replaceIndex || new propindex_1.PropIndex();
    groupBy.forEach((grpBy) => {
        if (isExtendedGroupBy(grpBy)) {
            include.setByKey(grpBy.property, true);
            replaceIndex.setByKey(grpBy.property, grpBy.replace);
        }
        else {
            include.setByKey(grpBy, true);
        }
    });
    return {
        include: include,
        replaceIndex: replaceIndex,
        replacer: shorthand_1.getReplacerIndex(replaceIndex)
    };
}
exports.parseGroupBy = parseGroupBy;
function toString(groupBy) {
    if (util_1.isArray(groupBy)) {
        return groupBy.map((g) => {
            if (isExtendedGroupBy(g)) {
                if (g.replace) {
                    let replaceIndex = util_2.keys(g.replace).reduce((index, valFrom) => {
                        const valTo = g.replace[valFrom];
                        (index[valTo] = index[valTo] || []).push(valFrom);
                        return index;
                    }, {});
                    return `${g.property}[` + util_2.keys(replaceIndex).map((valTo) => {
                        const valsFrom = replaceIndex[valTo].sort();
                        return `${valsFrom.join(',')}=>${valTo}`;
                    }).join(';') + ']';
                }
                return g.property;
            }
            return g;
        }).join(',');
    }
    else {
        return groupBy;
    }
}
exports.toString = toString;
exports.GROUP_BY_FIELD_TRANSFORM = [
    property_1.Property.FIELD, property_1.Property.TYPE,
    property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.STACK
];
exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM.concat([
    {
        property: property_1.Property.CHANNEL,
        replace: {
            'x': 'xy', 'y': 'xy',
            'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
            'row': 'facet', 'column': 'facet'
        }
    }
]);
//# sourceMappingURL=groupby.js.map