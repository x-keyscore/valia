"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatsManager = void 0;
const utils_1 = require("../../utils");
class FormatsManager {
    constructor() {
        this.formats = new Map();
    }
    set(formats) {
        for (const [type, format] of Object.entries(formats)) {
            this.formats.set(type, format);
        }
    }
    get(type) {
        const format = this.formats.get(type);
        if (!format)
            throw new utils_1.Issue("Checking", "The format type '" + type + "' is unknown.");
        return (format);
    }
}
exports.FormatsManager = FormatsManager;
