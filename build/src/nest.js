"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSED_GROUP_BY_ENCODING = exports.PARSED_GROUP_BY_FIELD_TRANSFORM = exports.getGroupByKey = exports.nest = exports.SPEC = exports.ENCODING = exports.FIELD_TRANSFORM = exports.FIELD = exports.registerKeyFn = void 0;
const util_1 = require("datalib/src/util");
const property_1 = require("./property");
const propindex_1 = require("./propindex");
const groupby_1 = require("./query/groupby");
const shorthand_1 = require("./query/shorthand");
/**
 * Registry for all possible grouping key functions.
 */
let groupRegistry = {};
/**
 * Add a grouping function to the registry.
 */
function registerKeyFn(name, keyFn) {
    groupRegistry[name] = keyFn;
}
exports.registerKeyFn = registerKeyFn;
exports.FIELD = 'field';
exports.FIELD_TRANSFORM = 'fieldTransform';
exports.ENCODING = 'encoding';
exports.SPEC = 'spec';
/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
function nest(specModels, queryNest) {
    if (queryNest) {
        const rootGroup = {
            name: '',
            path: '',
            items: []
        };
        let groupIndex = {};
        // global `includes` and `replaces` will get augmented by each level's groupBy.
        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
        // `replace` can be overriden in a lower-level to support different grouping.
        let includes = [];
        let replaces = [];
        let replacers = [];
        for (let l = 0; l < queryNest.length; l++) {
            includes.push(l > 0 ? includes[l - 1].duplicate() : new propindex_1.PropIndex());
            replaces.push(l > 0 ? replaces[l - 1].duplicate() : new propindex_1.PropIndex());
            const groupBy = queryNest[l].groupBy;
            if (util_1.isArray(groupBy)) {
                // If group is array, it's an array of extended group by that need to be parsed
                let parsedGroupBy = groupby_1.parseGroupBy(groupBy, includes[l], replaces[l]);
                replacers.push(parsedGroupBy.replacer);
            }
        }
        // With includes and replacers, now we can construct the nesting tree
        specModels.forEach(specM => {
            let path = '';
            let group = rootGroup;
            for (let l = 0; l < queryNest.length; l++) {
                const groupBy = (group.groupBy = queryNest[l].groupBy);
                group.orderGroupBy = queryNest[l].orderGroupBy;
                const key = util_1.isArray(groupBy)
                    ? shorthand_1.spec(specM.specQuery, includes[l], replacers[l])
                    : groupRegistry[groupBy](specM.specQuery);
                path += `/${key}`;
                if (!groupIndex[path]) {
                    // this item already exists on the path
                    groupIndex[path] = {
                        name: key,
                        path: path,
                        items: []
                    };
                    group.items.push(groupIndex[path]);
                }
                group = groupIndex[path];
            }
            group.items.push(specM);
        });
        return rootGroup;
    }
    else {
        // no nesting, just return a flat group
        return {
            name: '',
            path: '',
            items: specModels
        };
    }
}
exports.nest = nest;
// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_FIELD = [property_1.Property.FIELD];
const PARSED_GROUP_BY_FIELD = groupby_1.parseGroupBy(GROUP_BY_FIELD);
function getGroupByKey(specM, groupBy) {
    return groupRegistry[groupBy](specM);
}
exports.getGroupByKey = getGroupByKey;
registerKeyFn(exports.FIELD, (specQ) => {
    return shorthand_1.spec(specQ, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
});
exports.PARSED_GROUP_BY_FIELD_TRANSFORM = groupby_1.parseGroupBy(groupby_1.GROUP_BY_FIELD_TRANSFORM);
registerKeyFn(exports.FIELD_TRANSFORM, (specQ) => {
    return shorthand_1.spec(specQ, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.include, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
});
exports.PARSED_GROUP_BY_ENCODING = groupby_1.parseGroupBy(groupby_1.GROUP_BY_ENCODING);
registerKeyFn(exports.ENCODING, (specQ) => {
    return shorthand_1.spec(specQ, exports.PARSED_GROUP_BY_ENCODING.include, exports.PARSED_GROUP_BY_ENCODING.replacer);
});
registerKeyFn(exports.SPEC, (specQ) => JSON.stringify(specQ));
//# sourceMappingURL=nest.js.map