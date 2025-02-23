import type { SetableCriteria, FormatTemplate, SetableCriteriaMap, SetableCriteriaTemplate } from "./formats";
import type { Constructor } from "../types";
import type { SchemaType } from "./types";
import { Schema } from "./schema";
import { Issue } from "../utils";
import { ClassicTypesTemplate, GenericTypesTemplate } from "./formats/types";

export abstract class AbstractPlugin<const T extends SetableCriteria> extends Schema<T> {
	/**
	 * This method is automatically called before the schema initialization.
	 * 
	 * This allows, for example, to subscribe to events that will occur
	 * during the initialization.
	 */
	protected abstract beforeInitate(): void;

	/**
	 * This method is automatically called after the schema initialization.
	 */
	protected abstract afterInitate(): void;

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
		let beforeInitKeys: string[] = [];
		let afterInitKeys: string[] = [];

		const pluggedSchema = class PluggedSchema<T extends SetableCriteria> extends Schema<T> {
			constructor(criteria: T) {
				super(criteria);

				// METHODE CALL BEFORE INITIATION
				for (const key of beforeInitKeys) {
					(this[key as keyof typeof this] as () => any)();
				}

				this.initiate(criteria);

				// METHODE CALL AFTER INITIATION
				for (const key of afterInitKeys) {
					(this[key as keyof typeof this] as () => any)();
				}
			}
		}

		const transformKey = (key: string) => {
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
		}

		for (const plugin of plugins) {
			if (!plugin) break;
			assignProperties(plugin, pluggedSchema, transformKey);
		}

		return (pluggedSchema) as new (...args: T[] & V[] & X[]) => U & W & Y;
	} catch (err) {
		if (err instanceof Error) throw new Issue("Schema plugins", err.message);
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