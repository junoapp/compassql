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
exports.getExtendedType = exports.NONE = exports.K = exports.N = exports.O = exports.TIMEUNIT_O = exports.TIMEUNIT_T = exports.T = exports.BIN_Q = exports.Q = exports.ExtendedType = void 0;
const scale_1 = require("vega-lite/build/src/scale");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const encoding_1 = require("../../query/encoding");
const expandedtype_1 = require("../../query/expandedtype");
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
var ExtendedType;
(function (ExtendedType) {
    ExtendedType[ExtendedType["Q"] = TYPE.QUANTITATIVE] = "Q";
    ExtendedType[ExtendedType["BIN_Q"] = (`bin_${TYPE.QUANTITATIVE}`)] = "BIN_Q";
    ExtendedType[ExtendedType["T"] = TYPE.TEMPORAL] = "T";
    /**
     * Time Unit Temporal Field with time scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
    /**
     * Time Unit Temporal Field with ordinal scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_O"] = (`timeUnit_${TYPE.ORDINAL}`)] = "TIMEUNIT_O";
    ExtendedType[ExtendedType["O"] = TYPE.ORDINAL] = "O";
    ExtendedType[ExtendedType["N"] = TYPE.NOMINAL] = "N";
    ExtendedType[ExtendedType["K"] = expandedtype_1.ExpandedType.KEY] = "K";
    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
})(ExtendedType = exports.ExtendedType || (exports.ExtendedType = {}));
exports.Q = ExtendedType.Q;
exports.BIN_Q = ExtendedType.BIN_Q;
exports.T = ExtendedType.T;
exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
exports.O = ExtendedType.O;
exports.N = ExtendedType.N;
exports.K = ExtendedType.K;
exports.NONE = ExtendedType.NONE;
function getExtendedType(fieldQ) {
    if (fieldQ.bin) {
        return ExtendedType.BIN_Q;
    }
    else if (fieldQ.timeUnit) {
        const sType = encoding_1.scaleType(fieldQ);
        return scale_1.hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
    }
    return fieldQ.type;
}
exports.getExtendedType = getExtendedType;
//# sourceMappingURL=type.js.map