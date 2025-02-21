import type { SetableCriteria } from "./formats";
import type { Constructor } from "../types";
import type { SchemaType } from "./types";
import { Schema } from "./schema";
import { Issue } from "../utils";

export abstract class AbstractPlugin<const T extends SetableCriteria> extends Schema<T> {
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

function assignProperties(
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
			throw new Error(`Property key conflict in prototype properties.\nConflictual key: '${key}'`);
		}

		Object.defineProperty(target.prototype, newKey, srcPrototypeDescriptors[key]);
	}

	for (const key in srcDescriptors) {
		if (["prototype", "length", "name"].includes(key)) continue;

		let newKey = transformKey?.(key) || key;
		if (newKey in target) {
			throw Error(`Property key conflict in static properties.\nConflictual key: '${key}'`);
		}

		Object.defineProperty(target, newKey, srcPrototypeDescriptors[key]);
	}
}

export function SchemaPlugins<T, U, V, W, X, Y>(
	plugin_1: new (...args: T[]) => U,
	plugin_2?: new (...args: V[]) => W,
	plugin_3?: new (...args: X[]) => Y
) {
	try {
		let plugins = [plugin_1, plugin_2, plugin_3];
		let methodInitKeys: string[] = [];

		const pluggedSchema = class PluggedSchema<T extends SetableCriteria> extends Schema<T> {
			constructor(...args: ConstructorParameters<typeof Schema<T>>) {
				super(...args);

				for (const key of methodInitKeys) {
					(this[key as keyof typeof this] as (...args: any[]) => any)(...args);
				}

				this.mountCriteria(args[0]);
			}
		}

		const transformKey = (key: string) => {
			if (key === "init") {
				const newKey = "init_" + methodInitKeys.length;
				methodInitKeys.push(newKey);
				return (newKey);
			}
		}

		for (const plugin of plugins) {
			if (!plugin) break;
			assignProperties(plugin, pluggedSchema, transformKey);
		}

		return (pluggedSchema) as new (...args: T[] & V[] & X[]) => U & W & Y;
	} catch (err) {
		if (err instanceof Error) throw new Issue("Schema factory", err.message);
		throw err;
	}
}