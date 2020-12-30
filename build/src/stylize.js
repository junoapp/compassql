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
exports.xAxisOnTopForHighYCardinalityWithoutColumn = exports.nominalColorScaleForHighCardinality = exports.smallRangeStepForHighCardinalityOrFacet = exports.stylize = void 0;
const CHANNEL = __importStar(require("vega-lite/build/src/channel"));
const scale_1 = require("vega-lite/build/src/scale");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const encoding_1 = require("./query/encoding");
const expandedtype_1 = require("./query/expandedtype");
function stylize(answerSet, schema, opt) {
    let encQIndex = {};
    answerSet = answerSet.map(function (specM) {
        if (opt.smallRangeStepForHighCardinalityOrFacet) {
            specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
        }
        if (opt.nominalColorScaleForHighCardinality) {
            specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
        }
        if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
            specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
        }
        return specM;
    });
    return answerSet;
}
exports.stylize = stylize;
function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
    [CHANNEL.ROW, CHANNEL.Y, CHANNEL.COLUMN, CHANNEL.X].forEach(channel => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    const yEncQ = encQIndex[CHANNEL.Y];
    if (yEncQ !== undefined && encoding_1.isFieldQuery(yEncQ)) {
        if (encQIndex[CHANNEL.ROW] ||
            schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // We check for undefined rather than
            // yEncQ.scale = yEncQ.scale || {} to cover the case where
            // yEncQ.scale has been set to false/null.
            // This prevents us from incorrectly overriding scale and
            // assigning a rangeStep when scale is set to false.
            if (yEncQ.scale === undefined) {
                yEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            const yScaleType = encoding_1.scaleType(yEncQ);
            if (yEncQ.scale && (yScaleType === undefined || scale_1.hasDiscreteDomain(yScaleType))) {
                if (!specM.specQuery.height) {
                    specM.specQuery.height = { step: 12 };
                }
            }
        }
    }
    const xEncQ = encQIndex[CHANNEL.X];
    if (encoding_1.isFieldQuery(xEncQ)) {
        if (encQIndex[CHANNEL.COLUMN] ||
            schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // Just like y, we don't want to do this if scale is null/false
            if (xEncQ.scale === undefined) {
                xEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            const xScaleType = encoding_1.scaleType(xEncQ);
            if (xEncQ.scale && (xScaleType === undefined || scale_1.hasDiscreteDomain(xScaleType))) {
                if (!specM.specQuery.width) {
                    specM.specQuery.width = { step: 12 };
                }
            }
        }
    }
    return specM;
}
exports.smallRangeStepForHighCardinalityOrFacet = smallRangeStepForHighCardinalityOrFacet;
function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
    encQIndex[CHANNEL.COLOR] = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
    const colorEncQ = encQIndex[CHANNEL.COLOR];
    if (encoding_1.isFieldQuery(colorEncQ) &&
        colorEncQ !== undefined &&
        (colorEncQ.type === TYPE.NOMINAL || colorEncQ.type === expandedtype_1.ExpandedType.KEY) &&
        schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality) {
        if (colorEncQ.scale === undefined) {
            colorEncQ.scale = {};
        }
        if (colorEncQ.scale) {
            if (!colorEncQ.scale.range) {
                colorEncQ.scale.scheme = opt.nominalColorScaleForHighCardinality.palette;
            }
        }
    }
    return specM;
}
exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
    [CHANNEL.COLUMN, CHANNEL.X, CHANNEL.Y].forEach(channel => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    if (encQIndex[CHANNEL.COLUMN] === undefined) {
        const xEncQ = encQIndex[CHANNEL.X];
        const yEncQ = encQIndex[CHANNEL.Y];
        if (encoding_1.isFieldQuery(xEncQ) &&
            encoding_1.isFieldQuery(yEncQ) &&
            yEncQ !== undefined &&
            yEncQ.field &&
            scale_1.hasDiscreteDomain(encoding_1.scaleType(yEncQ))) {
            if (xEncQ !== undefined) {
                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                    if (xEncQ.axis === undefined) {
                        xEncQ.axis = {};
                    }
                    if (xEncQ.axis && !xEncQ.axis.orient) {
                        xEncQ.axis.orient = 'top';
                    }
                }
            }
        }
    }
    return specM;
}
exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;
//# sourceMappingURL=stylize.js.map