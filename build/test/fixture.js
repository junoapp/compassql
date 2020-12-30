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
exports.schema = void 0;
const TYPE = __importStar(require("vega-lite/build/src/type"));
const schema_1 = require("../src/schema");
const fixtures = [
    {
        name: 'Q',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 100 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q1',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 100 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q2',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 100 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q5',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 5 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q10',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 10 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q15',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 15 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'Q20',
        vlType: TYPE.QUANTITATIVE,
        type: schema_1.PrimitiveType.NUMBER,
        stats: { distinct: 20 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'T',
        vlType: TYPE.TEMPORAL,
        type: schema_1.PrimitiveType.DATETIME,
        stats: {
            distinct: 100,
            unique: { '2000/1/1': 1, '2000/1/2': 1 }
        },
        timeStats: {
            year: {
                distinct: 2,
                unique: { '2000/1/1': 1, '2000/1/2': 1 }
            },
            month: {
                distinct: 2,
                unique: { '2000/1/1': 1, '2000/1/2': 1 }
            },
            day: {
                distinct: 2,
                unique: { '2000/1/1': 1, '2000/1/2': 1 }
            }
        }
    },
    {
        name: 'T1',
        vlType: TYPE.TEMPORAL,
        type: schema_1.PrimitiveType.DATETIME,
        stats: { distinct: 100 },
        timeStats: { year: { distinct: 5 }, month: { distinct: 12 }, day: { distinct: 5 } }
    },
    {
        name: 'O',
        vlType: TYPE.ORDINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 6 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'O_10',
        vlType: TYPE.ORDINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 10 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'O_20',
        vlType: TYPE.ORDINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 20 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'O_100',
        vlType: TYPE.ORDINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 100 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'N',
        vlType: TYPE.NOMINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 6 } // HACK so that we don't have to define all summary properties
    },
    {
        name: 'N20',
        vlType: TYPE.NOMINAL,
        type: schema_1.PrimitiveType.STRING,
        stats: { distinct: 20 } // HACK so that we don't have to define all summary properties
    }
];
// make sure binStats isn't undefined
for (let fieldSchema of fixtures) {
    fieldSchema.binStats = {};
}
exports.schema = new schema_1.Schema({ fields: fixtures });
//# sourceMappingURL=fixture.js.map