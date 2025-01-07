"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFormat = exports.defaultCriteria = void 0;
exports.defaultCriteria = {
    require: true
};
class AbstractFormat {
    baseCriteria;
    constructor(predefinedCriteria) {
        this.baseCriteria = Object.assign({}, exports.defaultCriteria, predefinedCriteria);
    }
}
exports.AbstractFormat = AbstractFormat;
