import type { TunableCriteria } from "./formats";
import type { Constructor } from "../types";
import type { SchemaType } from "./types";
import { Schema } from "./Schema";
import { Err } from "../utils";

export abstract class SchemaPluginAbstract<const T extends TunableCriteria> extends Schema<T> {
    /**
     * This method is required because if the user mixes multiple plugins, the constructors cannot be used.
     * 
     * Therefore, this method will be called when the main class is instantiated.
     */
    protected abstract init(...args: ConstructorParameters<SchemaType<T>>): void;

    constructor(...args: ConstructorParameters<SchemaType<T>>) {
        super(...args);
    }
}

function mixinProperties(
	source: Constructor,
	target: Constructor,
	transformKey?: (key: string) => string | undefined
) {
	const srcPrototypeDescriptors = Object.getOwnPropertyDescriptors(source.prototype);
	const srcDescriptors = Object.getOwnPropertyDescriptors(source);

	for (const key in srcPrototypeDescriptors) {
		if (key === "constructor") continue;

		let newKey = transformKey?.(key) || key;
		if (newKey in target.prototype) {
			throw new Error(`Property key conflict in prototype properties.\nConflicting key: '${key}'`);
		}

		Object.defineProperty(target.prototype, newKey, srcPrototypeDescriptors[key]);
	}

	for (const key in srcDescriptors) {
		if (["prototype", "length", "name"].includes(key)) continue;

		let newKey = transformKey?.(key) || key;
		if (newKey in target) {
			throw Error(`Property key conflict in static properties.\nConflicting key: '${key}'`);
		}

		Object.defineProperty(target, newKey, srcPrototypeDescriptors[key]);
	}
}

export function schemaPlugins<T, U, V, W, X, Y>(
    plugin_1: new (...args: T[]) => U,
    plugin_2?: new (...args: V[]) => W,
    plugin_3?: new (...args: X[]) => Y
) {
    try {
        let plugins = [plugin_1, plugin_2, plugin_3];
        let initMethodKeys: string[] = [];

        const transformKey = (key: string) => {
            if (key === "init") {
                const newKey = "init_" + initMethodKeys.length;
                initMethodKeys.push(newKey);
                return (newKey);
            }
        }

        const extendedSchema = class ExtendedSchema<T extends TunableCriteria> extends Schema<T> {
            constructor(...args: ConstructorParameters<typeof Schema<T>>) {
                super(...args);

                for (const key of initMethodKeys) {
                    (this[key as keyof typeof this] as (...args: any[]) => any)(...args);
                }
            }
        }

        for (const plugin of plugins) {
            if (!plugin) break;
            mixinProperties(plugin, extendedSchema, transformKey);
        }

        return extendedSchema as new (...args: T[] & V[] & X[]) => U & W & Y;
    } catch (err) {
        if (err instanceof Error) throw new Err("Schema plugining", err.message);
        throw err;
    }
}