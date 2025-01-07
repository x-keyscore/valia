"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.construct = construct;
exports.constructs = constructs;
exports.profiler = profiler;
function construct(target, args) {
    return Reflect.construct(target, args);
}
function constructs(constructors, args) {
    return Object.fromEntries(Object.entries(constructors).map(([key, constructor]) => [key, construct(constructor, args)]));
}
function profiler() {
    return {
        startTime: performance.now(),
        end(decimal) {
            if (decimal)
                return (performance.now() - this.startTime).toFixed(decimal);
            return (performance.now() - this.startTime);
        }
    };
}
