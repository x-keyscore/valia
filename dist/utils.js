"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = void 0;
class Issue extends Error {
    constructor(context, message, plugin) {
        super(message);
        const red = "\x1b[31m", cyan = "\x1b[36m", gray = "\x1b[90m", reset = "\x1b[0m";
        const emitter = "valia" + (plugin ? ":" + plugin : "");
        const timestamp = new Date().toISOString();
        this.message =
            `${red}[ERROR]${reset} ${cyan}[${emitter}]${reset} ${gray}${timestamp}${reset}` +
                `\nContext: ${context}` +
                `\nMessage: ${message}`;
    }
}
exports.Issue = Issue;
