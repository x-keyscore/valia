"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryError = void 0;
exports.construct = construct;
exports.constructs = constructs;
function construct(target, args) {
    return Reflect.construct(target, args);
}
function constructs(constructors, args) {
    return Object.fromEntries(Object.entries(constructors).map(([key, constructor]) => [key, construct(constructor, args)]));
}
class LibraryError extends Error {
    printError(context) {
        const timestamp = new Date().toISOString();
        const red = '\x1b[31m';
        const gray = '\x1b[90m';
        const cyan = '\x1b[36m';
        const yellow = '\x1b[33m';
        const reset = '\x1b[0m';
        console.log(`${red}[ERROR]${reset} ${cyan}[LIBRARY:vali.ts]${reset} ${gray}${timestamp}${reset}` +
            `\nContext: ${context}` +
            `\nMessage: ${this.message}`);
    }
    constructor(context, message) {
        super(message);
        this.printError(context);
    }
}
exports.LibraryError = LibraryError;
