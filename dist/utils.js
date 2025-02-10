"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = void 0;
class Err extends Error {
    print(context, plugin) {
        const timestamp = new Date().toISOString();
        const red = '\x1b[31m';
        const gray = '\x1b[90m';
        const cyan = '\x1b[36m';
        const reset = '\x1b[0m';
        console.log(`${red}[ERROR]${reset} ${cyan}[valie${plugin ? `:${plugin}` : ""}]${reset} ${gray}${timestamp}${reset}` +
            `\nContext: ${context}` +
            `\nMessage: ${this.message}`);
    }
    constructor(context, message, plugin) {
        super(message);
        this.print(context, plugin);
    }
}
exports.Err = Err;
