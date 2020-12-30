"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLeaves = exports.getTopResultTreeItem = exports.isResultTree = void 0;
function isResultTree(item) {
    return item.items !== undefined;
}
exports.isResultTree = isResultTree;
function getTopResultTreeItem(specQuery) {
    let topItem = specQuery.items[0];
    while (topItem && isResultTree(topItem)) {
        topItem = topItem.items[0];
    }
    return topItem;
}
exports.getTopResultTreeItem = getTopResultTreeItem;
function mapLeaves(group, f) {
    return Object.assign(Object.assign({}, group), { items: group.items.map(item => (isResultTree(item) ? mapLeaves(item, f) : f(item))) });
}
exports.mapLeaves = mapLeaves;
//# sourceMappingURL=result.js.map