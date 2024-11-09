"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFormat = void 0;
const defaultCriteria = {
    require: true
};
class AbstractFormat {
    definedCriteria;
    constructor(definedCriteria) {
        this.definedCriteria = definedCriteria;
    }
    get criteria() {
        return { ...defaultCriteria, ...this.predefinedCriteria, ...this.definedCriteria };
    }
}
exports.AbstractFormat = AbstractFormat;
