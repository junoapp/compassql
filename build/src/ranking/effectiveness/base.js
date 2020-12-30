"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorer = void 0;
class Scorer {
    constructor(type) {
        this.type = type;
        this.scoreIndex = this.initScore();
    }
    getFeatureScore(feature) {
        const type = this.type;
        const score = this.scoreIndex[feature];
        if (score !== undefined) {
            return { type, feature, score };
        }
        return undefined;
    }
}
exports.Scorer = Scorer;
//# sourceMappingURL=base.js.map