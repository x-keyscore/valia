"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatsManager = formatsManager;
const utils_1 = require("../../utils");
function formatsManager() {
    return ({
        formats: new Map(),
        set(formats) {
            for (const [type, format] of Object.entries(formats)) {
                this.formats.set(type, format);
            }
        },
        get(type) {
            const format = this.formats.get(type);
            if (!format)
                throw new utils_1.Issue("Checking", "The format type '" + type + "' is unknown.");
            return (format);
        }
    });
}
