"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = hasTag;
function hasTag(target, tag) {
    return (Object.prototype.toString.call(target).slice(8, -1) === tag);
}
