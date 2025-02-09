"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dispatcher {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    emit(event, ...args) {
        const callbacks = this.listeners[event];
        if (!callbacks)
            return;
        for (const callback of callbacks) {
            callback(...args);
        }
    }
    off(event, callback) {
        const listeners = this.listeners[event];
        if (!listeners)
            return;
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
}
const test = new Dispatcher();
test.emit("check", "sd", "er");
