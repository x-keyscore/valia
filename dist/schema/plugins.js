"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaPluginAbstract = void 0;
exports.schemaPlugins = schemaPlugins;
const Schema_1 = require("./Schema");
const utils_1 = require("../utils");
class SchemaPluginAbstract extends Schema_1.Schema {
    constructor(...args) {
        super(...args);
    }
}
exports.SchemaPluginAbstract = SchemaPluginAbstract;
function mixinProperties(source, target, transformKey) {
    const srcPrototypeDescriptors = Object.getOwnPropertyDescriptors(source.prototype);
    const srcDescriptors = Object.getOwnPropertyDescriptors(source);
    for (const key in srcPrototypeDescriptors) {
        if (key === "constructor")
            continue;
        let newKey = (transformKey === null || transformKey === void 0 ? void 0 : transformKey(key)) || key;
        if (newKey in target.prototype) {
            throw new Error(`Property key conflict in prototype properties.\nConflicting key: '${key}'`);
        }
        Object.defineProperty(target.prototype, newKey, srcPrototypeDescriptors[key]);
    }
    for (const key in srcDescriptors) {
        if (["prototype", "length", "name"].includes(key))
            continue;
        let newKey = (transformKey === null || transformKey === void 0 ? void 0 : transformKey(key)) || key;
        if (newKey in target) {
            throw Error(`Property key conflict in static properties.\nConflicting key: '${key}'`);
        }
        Object.defineProperty(target, newKey, srcPrototypeDescriptors[key]);
    }
}
function schemaPlugins(plugin_1, plugin_2, plugin_3) {
    try {
        let plugins = [plugin_1, plugin_2, plugin_3];
        let initMethodKeys = [];
        const pluggedSchema = class PluggedSchema extends Schema_1.Schema {
            constructor(...args) {
                super(...args);
                for (const key of initMethodKeys) {
                    this[key](...args);
                }
            }
        };
        const transformKey = (key) => {
            if (key === "init") {
                const newKey = "init_" + initMethodKeys.length;
                initMethodKeys.push(newKey);
                return (newKey);
            }
        };
        for (const plugin of plugins) {
            if (!plugin)
                break;
            mixinProperties(plugin, pluggedSchema, transformKey);
        }
        return pluggedSchema;
    }
    catch (err) {
        if (err instanceof Error)
            throw new utils_1.Err("Schema extending", err.message);
        throw err;
    }
}
