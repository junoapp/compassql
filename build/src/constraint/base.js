"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingConstraintModel = exports.AbstractConstraintModel = void 0;
const property_1 = require("../property");
const wildcard_1 = require("../wildcard");
const util_1 = require("../util");
/**
 * Abstract model for a constraint.
 */
class AbstractConstraintModel {
    constructor(constraint) {
        this.constraint = constraint;
    }
    name() {
        return this.constraint.name;
    }
    description() {
        return this.constraint.description;
    }
    properties() {
        return this.constraint.properties;
    }
    strict() {
        return this.constraint.strict;
    }
}
exports.AbstractConstraintModel = AbstractConstraintModel;
class EncodingConstraintModel extends AbstractConstraintModel {
    constructor(constraint) {
        super(constraint);
    }
    hasAllRequiredPropertiesSpecific(encQ) {
        return util_1.every(this.constraint.properties, (prop) => {
            if (property_1.isEncodingNestedProp(prop)) {
                let parent = prop.parent;
                let child = prop.child;
                if (!encQ[parent]) {
                    return true;
                }
                return !wildcard_1.isWildcard(encQ[parent][child]);
            }
            if (!encQ[prop]) {
                return true;
            }
            return !wildcard_1.isWildcard(encQ[prop]);
        });
    }
    satisfy(encQ, schema, encWildcardIndex, opt) {
        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
        if (!this.constraint.allowWildcardForProperties) {
            // TODO: extract as a method and do unit test
            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
    }
}
exports.EncodingConstraintModel = EncodingConstraintModel;
//# sourceMappingURL=base.js.map