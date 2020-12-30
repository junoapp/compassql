"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingPropertyGeneratorFactory = exports.getEnumerator = void 0;
const encoding_1 = require("./constraint/encoding");
const spec_1 = require("./constraint/spec");
const property_1 = require("./property");
const propindex_1 = require("./propindex");
const encoding_2 = require("./query/encoding");
const ENUMERATOR_INDEX = new propindex_1.PropIndex();
function getEnumerator(prop) {
    return ENUMERATOR_INDEX.get(prop);
}
exports.getEnumerator = getEnumerator;
ENUMERATOR_INDEX.set('mark', (wildcardIndex, schema, opt) => {
    return (answerSet, specM) => {
        const markWildcard = specM.getMark();
        // enumerate the value
        markWildcard.enum.forEach((mark) => {
            specM.setMark(mark);
            // Check spec constraint
            const violatedSpecConstraint = spec_1.checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
            if (!violatedSpecConstraint) {
                // emit
                answerSet.push(specM.duplicate());
            }
        });
        // Reset to avoid side effect
        specM.resetMark();
        return answerSet;
    };
});
property_1.ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
    ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
});
property_1.ENCODING_NESTED_PROPS.forEach((nestedProp) => {
    ENUMERATOR_INDEX.set(nestedProp, EncodingPropertyGeneratorFactory(nestedProp));
});
/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
function EncodingPropertyGeneratorFactory(prop) {
    /**
     * @return as reducer that takes a specQueryModel as input and output an answer set array.
     */
    return (wildcardIndex, schema, opt) => {
        return (answerSet, specM) => {
            // index of encoding mappings that require enumeration
            const indices = wildcardIndex.encodingIndicesByProperty.get(prop);
            function enumerate(jobIndex) {
                if (jobIndex === indices.length) {
                    // emit and terminate
                    answerSet.push(specM.duplicate());
                    return;
                }
                const index = indices[jobIndex];
                const wildcard = wildcardIndex.encodings[index].get(prop);
                const encQ = specM.getEncodingQueryByIndex(index);
                const propWildcard = specM.getEncodingProperty(index, prop);
                if (encoding_2.isValueQuery(encQ) || (
                // TODO: encQ.exclude
                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
                // for this encoding query because they will be excluded anyway.
                // Thus, we can just move on to the next encoding to enumerate.
                (encoding_2.isDisabledAutoCountQuery(encQ)) ||
                    // nested encoding property might have its parent set to false
                    // therefore, we no longer have to enumerate them
                    !propWildcard)) { // TODO: encQ.excluded
                    enumerate(jobIndex + 1);
                }
                else {
                    wildcard.enum.forEach((propVal) => {
                        if (propVal === null) {
                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
                            // convert undefined in an array into null
                            propVal = undefined;
                        }
                        specM.setEncodingProperty(index, prop, propVal, wildcard);
                        // Check encoding constraint
                        const violatedEncodingConstraint = encoding_1.checkEncoding(prop, wildcard, index, specM, schema, opt);
                        if (violatedEncodingConstraint) {
                            return; // do not keep searching
                        }
                        // Check spec constraint
                        const violatedSpecConstraint = spec_1.checkSpec(prop, wildcard, specM, schema, opt);
                        if (violatedSpecConstraint) {
                            return; // do not keep searching
                        }
                        // If qualify all of the constraints, keep enumerating
                        enumerate(jobIndex + 1);
                    });
                    // Reset to avoid side effect
                    specM.resetEncodingProperty(index, prop, wildcard);
                }
            }
            // start enumerating from 0
            enumerate(0);
            return answerSet;
        };
    };
}
exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;
//# sourceMappingURL=enumerator.js.map