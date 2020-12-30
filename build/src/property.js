"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.DEFAULT_PROP_PRECEDENCE = exports.ALL_ENCODING_PROPS = exports.isEncodingProperty = exports.getEncodingNestedProp = exports.fromKey = exports.toKey = exports.VIEW_PROPS = exports.ENCODING_NESTED_PROPS = exports.SCALE_PROPS = exports.SORT_PROPS = exports.SORT_CHILD_PROPS = exports.BIN_CHILD_PROPS = exports.isEncodingNestedParent = exports.isEncodingTopLevelProperty = exports.ENCODING_TOPLEVEL_PROPS = exports.isEncodingNestedProp = void 0;
const axis_1 = require("vega-lite/build/src/axis");
const legend_1 = require("vega-lite/build/src/legend");
const scale_1 = require("vega-lite/build/src/scale");
const util_1 = require("./util");
function isEncodingNestedProp(p) {
    return !!p['parent'];
}
exports.isEncodingNestedProp = isEncodingNestedProp;
const ENCODING_TOPLEVEL_PROP_INDEX = {
    channel: 1,
    aggregate: 1,
    autoCount: 1,
    bin: 1,
    timeUnit: 1,
    hasFn: 1,
    sort: 1,
    stack: 1,
    field: 1,
    type: 1,
    format: 1,
    scale: 1,
    axis: 1,
    legend: 1,
    value: 1
};
exports.ENCODING_TOPLEVEL_PROPS = util_1.flagKeys(ENCODING_TOPLEVEL_PROP_INDEX);
function isEncodingTopLevelProperty(p) {
    return p.toString() in ENCODING_TOPLEVEL_PROP_INDEX;
}
exports.isEncodingTopLevelProperty = isEncodingTopLevelProperty;
const ENCODING_NESTED_PROP_PARENT_INDEX = {
    bin: 1,
    scale: 1,
    sort: 1,
    axis: 1,
    legend: 1
};
function isEncodingNestedParent(prop) {
    return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
}
exports.isEncodingNestedParent = isEncodingNestedParent;
// FIXME -- we should not have to manually specify these
exports.BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
exports.SORT_CHILD_PROPS = ['field', 'op', 'order'];
const BIN_PROPS = exports.BIN_CHILD_PROPS.map((c) => {
    return { parent: 'bin', child: c };
});
exports.SORT_PROPS = exports.SORT_CHILD_PROPS.map((c) => {
    return { parent: 'sort', child: c };
});
exports.SCALE_PROPS = scale_1.SCALE_PROPERTIES.map((c) => {
    return { parent: 'scale', child: c };
});
const AXIS_PROPS = axis_1.AXIS_PROPERTIES.map((c) => {
    return { parent: 'axis', child: c };
});
const LEGEND_PROPS = legend_1.LEGEND_PROPERTIES.map((c) => {
    return { parent: 'legend', child: c };
});
exports.ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, exports.SORT_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
exports.VIEW_PROPS = ['width', 'height', 'background', 'padding', 'title'];
const PROP_KEY_DELIMITER = '.';
function toKey(p) {
    if (isEncodingNestedProp(p)) {
        return p.parent + PROP_KEY_DELIMITER + p.child;
    }
    return p;
}
exports.toKey = toKey;
function fromKey(k) {
    const split = k.split(PROP_KEY_DELIMITER);
    /* istanbul ignore else */
    if (split.length === 1) {
        return k;
    }
    else if (split.length === 2) {
        return {
            parent: split[0],
            child: split[1]
        };
    }
    else {
        throw `Invalid property key with ${split.length} dots: ${k}`;
    }
}
exports.fromKey = fromKey;
const ENCODING_NESTED_PROP_INDEX = exports.ENCODING_NESTED_PROPS.reduce((i, prop) => {
    i[prop.parent] = i[prop.parent] || [];
    i[prop.parent][prop.child] = prop;
    return i;
}, {});
// FIXME consider using a more general method
function getEncodingNestedProp(parent, child) {
    return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
}
exports.getEncodingNestedProp = getEncodingNestedProp;
function isEncodingProperty(p) {
    return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
}
exports.isEncodingProperty = isEncodingProperty;
exports.ALL_ENCODING_PROPS = [].concat(exports.ENCODING_TOPLEVEL_PROPS, exports.ENCODING_NESTED_PROPS);
exports.DEFAULT_PROP_PRECEDENCE = [
    'type',
    'field',
    // Field Transform
    'bin',
    'timeUnit',
    'aggregate',
    'autoCount',
    // Encoding
    'channel',
    // Mark
    'mark',
    'stack',
    'scale',
    'sort',
    'axis',
    'legend'
].concat(BIN_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, exports.SORT_PROPS);
var Property;
(function (Property) {
    Property.MARK = 'mark';
    Property.TRANSFORM = 'transform';
    // Layout
    Property.STACK = 'stack';
    Property.FORMAT = 'format';
    // TODO: sub parts of stack
    // Encoding Properties
    Property.CHANNEL = 'channel';
    Property.AGGREGATE = 'aggregate';
    Property.AUTOCOUNT = 'autoCount';
    Property.BIN = 'bin';
    Property.HAS_FN = 'hasFn';
    Property.TIMEUNIT = 'timeUnit';
    Property.FIELD = 'field';
    Property.TYPE = 'type';
    Property.SORT = 'sort';
    Property.SCALE = 'scale';
    Property.AXIS = 'axis';
    Property.LEGEND = 'legend';
    Property.WIDTH = 'width';
    Property.HEIGHT = 'height';
    Property.BACKGROUND = 'background';
    Property.PADDING = 'padding';
    Property.TITLE = 'title';
})(Property = exports.Property || (exports.Property = {}));
//# sourceMappingURL=property.js.map