"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEncoding = void 0;
const encoding_1 = require("../query/encoding");
const field_1 = require("./field");
const value_1 = require("./value");
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkEncoding(prop, wildcard, index, specM, schema, opt) {
    // Check encoding constraint
    const encodingConstraints = field_1.FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
    const encQ = specM.getEncodingQueryByIndex(index);
    for (const c of encodingConstraints) {
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
            if (!satisfy) {
                let violatedConstraint = `(enc) ${c.name()}`;
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(`${violatedConstraint} failed with ${specM.toShorthand()} for ${wildcard.name}`);
                }
                return violatedConstraint;
            }
        }
    }
    const valueContraints = value_1.VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
    for (const c of valueContraints) {
        // Check if the constraint is enabled
        if ((c.strict() || !!opt[c.name()]) && encoding_1.isValueQuery(encQ)) {
            // For strict constraint, or enabled non-strict, check the constraints
            const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
            if (!satisfy) {
                let violatedConstraint = `(enc) ${c.name()}`;
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(`${violatedConstraint} failed with ${specM.toShorthand()} for ${wildcard.name}`);
                }
                return violatedConstraint;
            }
        }
    }
    return null;
}
exports.checkEncoding = checkEncoding;
//# sourceMappingURL=encoding.js.map