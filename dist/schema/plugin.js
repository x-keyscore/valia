"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPlugin = void 0;
exports.SchemaPlugins = SchemaPlugins;
const schema_1 = require("./schema");
const utils_1 = require("../utils");
class AbstractPlugin extends schema_1.Schema {
    constructor(...args) {
        super(...args);
    }
}
exports.AbstractPlugin = AbstractPlugin;
function assignProperties(source, target, transformKey) {
    const srcPrototypeDescriptors = Object.getOwnPropertyDescriptors(source.prototype);
    const srcDescriptors = Object.getOwnPropertyDescriptors(source);
    for (const key in srcPrototypeDescriptors) {
        if (key === "constructor")
            continue;
        let newKey = (transformKey === null || transformKey === void 0 ? void 0 : transformKey(key)) || key;
        if (newKey in target.prototype) {
            throw new Error(`Property key conflict in prototype properties.\nConflictual key: '${key}'`);
        }
        Object.defineProperty(target.prototype, newKey, srcPrototypeDescriptors[key]);
    }
    for (const key in srcDescriptors) {
        if (["prototype", "length", "name"].includes(key))
            continue;
        let newKey = (transformKey === null || transformKey === void 0 ? void 0 : transformKey(key)) || key;
        if (newKey in target) {
            throw Error(`Property key conflict in static properties.\nConflictual key: '${key}'`);
        }
        Object.defineProperty(target, newKey, srcPrototypeDescriptors[key]);
    }
}
function SchemaPlugins(plugin_1, plugin_2, plugin_3) {
    try {
        let plugins = [plugin_1, plugin_2, plugin_3];
        let beforeInitKeys = [];
        let afterInitKeys = [];
        const pluggedSchema = class PluggedSchema extends schema_1.Schema {
            constructor(criteria) {
                super(criteria);
                // METHODE CALL BEFORE INITIATION
                for (const key of beforeInitKeys) {
                    this[key]();
                }
                this.initiate(criteria);
                // METHODE CALL AFTER INITIATION
                for (const key of afterInitKeys) {
                    this[key]();
                }
            }
        };
        const transformKey = (key) => {
            if (key === "beforeInitate") {
                const newKey = "beforeInitate_" + beforeInitKeys.length;
                beforeInitKeys.push(newKey);
                return (newKey);
            }
            if (key === "afterInitate") {
                const newKey = "afterInitate_" + afterInitKeys.length;
                afterInitKeys.push(newKey);
                return (newKey);
            }
        };
        for (const plugin of plugins) {
            if (!plugin)
                break;
            assignProperties(plugin, pluggedSchema, transformKey);
        }
        return (pluggedSchema);
    }
    catch (err) {
        if (err instanceof Error)
            throw new utils_1.Issue("Schema plugins", err.message);
        throw err;
    }
}
/*
interface ObjectIdSetableCriteria extends SetableCriteriaTemplate<"objectId"> {
    unique: boolean;
}

export interface ObjectIdClassicTypes extends ClassicTypesTemplate<
    ObjectIdSetableCriteria,
    {}
> {}

export interface ObjectIdGenericTypes<T extends SetableCriteria> extends GenericTypesTemplate<
    ObjectIdSetableCriteria,
    {},
    {}
> {}


declare module './formats/types' {
    interface FormatClassicTypes {
        objectId:  ObjectIdClassicTypes;
    }
    interface FormatGenericTypes<T extends SetableCriteria> {
        objectId: T extends ObjectIdSetableCriteria ? ObjectIdGenericTypes<T> : never;
    }
}

const ObjectId: FormatTemplate<ObjectIdSetableCriteria> = {
    defaultCriteria: {},
    mounting(queue, path, criteria) {
        
    },
    checking(queue, path, criteria, value) {
        return (null);
    }
}

class Mongo<T extends SetableCriteriaMap[keyof SetableCriteriaMap]> extends AbstractPlugin<T> {
    protected beforeInitate(): void {
        
    }

    protected afterInitate(): void {
        
    }

    constructor(...args: ConstructorParameters<SchemaType<T>>) {
        super(...args)
    }
}

class Maria<T extends SetableCriteriaMap[Exclude<keyof SetableCriteriaMap, "ObjectId">]> extends AbstractPlugin<T> {
    protected beforeInitate(): void {
        
    }

    protected afterInitate(): void {
        
    }

    constructor(...args: ConstructorParameters<SchemaType<T>>) {
        super(...args)
    }
}

const test = SchemaPlugins(Mongo, Maria)


const eerer = new test({ type: "objectId", unique: true})

eerer


const lala = new Schema({ type: "string"})*/ 
