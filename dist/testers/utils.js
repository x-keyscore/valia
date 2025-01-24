"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = hasTag;
exports.lazy = lazy;
function hasTag(x, tag) {
    return (Object.prototype.toString.call(x).slice(8, -1) === tag);
}
const supportWeakRef = typeof WeakRef !== 'undefined';
function lazy(callback) {
    let cache;
    return () => {
        if (supportWeakRef) {
            if (!(cache === null || cache === void 0 ? void 0 : cache.deref())) {
                cache = new WeakRef(callback());
            }
            return (cache === null || cache === void 0 ? void 0 : cache.deref());
        }
        else if (!cache) {
            cache = callback();
        }
        return (cache);
    };
}
