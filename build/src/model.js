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
exports.SpecQueryModel = void 0;
const util_1 = require("datalib/src/util");
const TYPE = __importStar(require("vega-lite/build/src/type"));
const nest_1 = require("./nest");
const property_1 = require("./property");
const encoding_1 = require("./query/encoding");
const groupby_1 = require("./query/groupby");
const shorthand_1 = require("./query/shorthand");
const spec_1 = require("./query/spec");
const util_2 = require("./util");
const wildcard_1 = require("./wildcard");
const wildcardindex_1 = require("./wildcardindex");
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
class SpecQueryModel {
    constructor(spec, wildcardIndex, schema, opt, wildcardAssignment) {
        this._rankingScore = {};
        this._spec = spec;
        this._channelFieldCount = spec.encodings.reduce((m, encQ) => {
            if (!wildcard_1.isWildcard(encQ.channel) && (!encoding_1.isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
                m[`${encQ.channel}`] = 1;
            }
            return m;
        }, {});
        this._wildcardIndex = wildcardIndex;
        this._assignedWildcardIndex = wildcardAssignment;
        this._opt = opt;
        this._schema = schema;
    }
    /**
     * Build a WildcardIndex by detecting wildcards
     * in the input specQuery and replacing short wildcards ("?")
     * with full ones (objects with `name` and `enum` values).
     *
     * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
     */
    static build(specQ, schema, opt) {
        let wildcardIndex = new wildcardindex_1.WildcardIndex();
        // mark
        if (wildcard_1.isWildcard(specQ.mark)) {
            const name = wildcard_1.getDefaultName(property_1.Property.MARK);
            specQ.mark = wildcard_1.initWildcard(specQ.mark, name, opt.enum.mark);
            wildcardIndex.setMark(specQ.mark);
        }
        // TODO: transform
        // encodings
        specQ.encodings.forEach((encQ, index) => {
            if (encoding_1.isAutoCountQuery(encQ)) {
                // This is only for testing purpose
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = TYPE.QUANTITATIVE; // autoCount is always quantitative
            }
            if (encoding_1.isFieldQuery(encQ) && encQ.type === undefined) {
                // type is optional -- we automatically augment wildcard if not specified
                encQ.type = wildcard_1.SHORT_WILDCARD;
            }
            // For each property of the encodingQuery, enumerate
            property_1.ENCODING_TOPLEVEL_PROPS.forEach(prop => {
                if (wildcard_1.isWildcard(encQ[prop])) {
                    // Assign default wildcard name and enum values.
                    const defaultWildcardName = wildcard_1.getDefaultName(prop) + index;
                    const defaultEnumValues = wildcard_1.getDefaultEnumValues(prop, schema, opt);
                    const wildcard = (encQ[prop] = wildcard_1.initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues));
                    // Add index of the encoding mapping to the property's wildcard index.
                    wildcardIndex.setEncodingProperty(index, prop, wildcard);
                }
            });
            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
            property_1.ENCODING_NESTED_PROPS.forEach(prop => {
                const propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
                if (propObj) {
                    const child = prop.child;
                    if (wildcard_1.isWildcard(propObj[child])) {
                        // Assign default wildcard name and enum values.
                        const defaultWildcardName = wildcard_1.getDefaultName(prop) + index;
                        const defaultEnumValues = wildcard_1.getDefaultEnumValues(prop, schema, opt);
                        const wildcard = (propObj[child] = wildcard_1.initWildcard(propObj[child], defaultWildcardName, defaultEnumValues));
                        // Add index of the encoding mapping to the property's wildcard index.
                        wildcardIndex.setEncodingProperty(index, prop, wildcard);
                    }
                }
            });
        });
        // AUTO COUNT
        // Add Auto Count Field
        if (opt.autoAddCount) {
            const channel = {
                name: wildcard_1.getDefaultName(property_1.Property.CHANNEL) + specQ.encodings.length,
                enum: wildcard_1.getDefaultEnumValues(property_1.Property.CHANNEL, schema, opt)
            };
            const autoCount = {
                name: wildcard_1.getDefaultName(property_1.Property.AUTOCOUNT) + specQ.encodings.length,
                enum: [false, true]
            };
            const countEncQ = {
                channel,
                autoCount,
                type: TYPE.QUANTITATIVE
            };
            specQ.encodings.push(countEncQ);
            const index = specQ.encodings.length - 1;
            // Add index of the encoding mapping to the property's wildcard index.
            wildcardIndex.setEncodingProperty(index, property_1.Property.CHANNEL, channel);
            wildcardIndex.setEncodingProperty(index, property_1.Property.AUTOCOUNT, autoCount);
        }
        return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
    }
    get wildcardIndex() {
        return this._wildcardIndex;
    }
    get schema() {
        return this._schema;
    }
    get specQuery() {
        return this._spec;
    }
    duplicate() {
        return new SpecQueryModel(util_2.duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, util_2.duplicate(this._assignedWildcardIndex));
    }
    setMark(mark) {
        const name = this._wildcardIndex.mark.name;
        this._assignedWildcardIndex[name] = this._spec.mark = mark;
    }
    resetMark() {
        const wildcard = (this._spec.mark = this._wildcardIndex.mark);
        delete this._assignedWildcardIndex[wildcard.name];
    }
    getMark() {
        return this._spec.mark;
    }
    getEncodingProperty(index, prop) {
        const encQ = this._spec.encodings[index];
        if (property_1.isEncodingNestedProp(prop)) {
            // nested encoding property
            return encQ[prop.parent][prop.child];
        }
        return encQ[prop]; // encoding property (non-nested)
    }
    setEncodingProperty(index, prop, value, wildcard) {
        const encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL && encQ.channel && !wildcard_1.isWildcard(encQ.channel)) {
            // If there is an old channel
            this._channelFieldCount[encQ.channel]--;
        }
        if (property_1.isEncodingNestedProp(prop)) {
            // nested encoding property
            encQ[prop.parent][prop.child] = value;
        }
        else if (property_1.isEncodingNestedParent(prop) && value === true) {
            encQ[prop] = util_2.extend({}, encQ[prop], // copy all existing properties
            { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
            );
        }
        else {
            // encoding property (non-nested)
            encQ[prop] = value;
        }
        this._assignedWildcardIndex[wildcard.name] = value;
        if (prop === property_1.Property.CHANNEL) {
            // If there is a new channel, make sure it exists and add it to the count.
            this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
        }
    }
    resetEncodingProperty(index, prop, wildcard) {
        const encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL) {
            this._channelFieldCount[encQ.channel]--;
        }
        // reset it to wildcard
        if (property_1.isEncodingNestedProp(prop)) {
            // nested encoding property
            encQ[prop.parent][prop.child] = wildcard;
        }
        else {
            // encoding property (non-nested)
            encQ[prop] = wildcard;
        }
        // add remove value that is reset from the assignment map
        delete this._assignedWildcardIndex[wildcard.name];
    }
    channelUsed(channel) {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._channelFieldCount[channel] > 0;
    }
    channelEncodingField(channel) {
        const encodingQuery = this.getEncodingQueryByChannel(channel);
        return encoding_1.isFieldQuery(encodingQuery);
    }
    getEncodings() {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._spec.encodings.filter(encQ => !encoding_1.isDisabledAutoCountQuery(encQ));
    }
    getEncodingQueryByChannel(channel) {
        for (let specEncoding of this._spec.encodings) {
            if (specEncoding.channel === channel) {
                return specEncoding;
            }
        }
        return undefined;
    }
    getEncodingQueryByIndex(i) {
        return this._spec.encodings[i];
    }
    isAggregate() {
        return spec_1.isAggregate(this._spec);
    }
    /**
     * @return The Vega-Lite `StackProperties` object that describes the stack
     * configuration of `this`. Returns `null` if this is not stackable.
     */
    getVlStack() {
        return spec_1.getVlStack(this._spec);
    }
    /**
     * @return The `StackOffset` specified in `this`, `undefined` if none
     * is specified.
     */
    getStackOffset() {
        return spec_1.getStackOffset(this._spec);
    }
    /**
     * @return The `ExtendedChannel` in which `stack` is specified in `this`, or
     * `null` if none is specified.
     */
    getStackChannel() {
        return spec_1.getStackChannel(this._spec);
    }
    toShorthand(groupBy) {
        if (groupBy) {
            if (util_1.isString(groupBy)) {
                return nest_1.getGroupByKey(this.specQuery, groupBy);
            }
            const parsedGroupBy = groupby_1.parseGroupBy(groupBy);
            return shorthand_1.spec(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
        }
        return shorthand_1.spec(this._spec);
    }
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    toSpec(data) {
        if (wildcard_1.isWildcard(this._spec.mark))
            return null;
        let spec = {};
        data = data || this._spec.data;
        if (data) {
            spec.data = data;
        }
        if (this._spec.transform) {
            spec.transform = this._spec.transform;
        }
        spec.mark = this._spec.mark;
        spec.encoding = encoding_1.toEncoding(this.specQuery.encodings, { schema: this._schema, wildcardMode: 'null' });
        if (this._spec.width) {
            spec.width = this._spec.width;
        }
        if (this._spec.height) {
            spec.height = this._spec.height;
        }
        if (this._spec.background) {
            spec.background = this._spec.background;
        }
        if (this._spec.padding) {
            spec.padding = this._spec.padding;
        }
        if (this._spec.title) {
            spec.title = this._spec.title;
        }
        if (spec.encoding === null) {
            return null;
        }
        if (this._spec.config || this._opt.defaultSpecConfig)
            spec.config = util_2.extend({}, this._opt.defaultSpecConfig, this._spec.config);
        return spec;
    }
    getRankingScore(rankingName) {
        return this._rankingScore[rankingName];
    }
    setRankingScore(rankingName, score) {
        this._rankingScore[rankingName] = score;
    }
}
exports.SpecQueryModel = SpecQueryModel;
//# sourceMappingURL=model.js.map