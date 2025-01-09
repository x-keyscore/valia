"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = hasTag;
function hasTag(x, tag) {
    return (Object.prototype.toString.call(x).slice(8, -1) === tag);
}
