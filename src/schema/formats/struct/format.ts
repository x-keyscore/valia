import type { Format, MountedCriteria } from "../types";
import type { StructSetableCriteria, StructDefinition } from "./types";
import { isPlainObject } from "../../../testers";

export interface CustomProperties {
	hasRequiredKeys(
		mountedCriteria: MountedCriteria<StructSetableCriteria>,
		value: (string | symbol)[]
	): boolean;
	hasAcceptedKeys(
		mountedCriteria: MountedCriteria<StructSetableCriteria>,
		value: (string | symbol)[]
	): boolean;
}

function isShorthandStruct(obj: object): obj is StructDefinition {
	return (isPlainObject(obj) && typeof obj?.type !== "string");
}

export const StructFormat: Format<StructSetableCriteria, CustomProperties> = {
	defaultCriteria: {},
	hasRequiredKeys(criteria, keys) {
		const requiredKeys = criteria.requiredKeys;
		return (requiredKeys.length <= keys.length && requiredKeys.every((key) => keys.includes(key)));
	},
	hasAcceptedKeys(criteria, keys) {
		const acceptedKeys = criteria.acceptedKeys;
		return (keys.length <= acceptedKeys.length && keys.every((key) => acceptedKeys.includes(key)));
	},
	mount(chunk, criteria) {
		const acceptedKeys = Reflect.ownKeys(criteria.struct);
		const requiredKeys = acceptedKeys.filter(key => !criteria.optional?.includes(key));

		Object.assign(criteria, { acceptedKeys, requiredKeys });

		for (let i = 0; i < acceptedKeys.length; i++) {
			const key = acceptedKeys[i];

			if (isShorthandStruct(criteria.struct[key])) {
				criteria.struct[key] = {
					type: "struct",
					struct: criteria.struct[key]
				}
			}

			chunk.push({
				node: criteria.struct[key],
				partPaths: {
					explicit: ["struct", key],
					implicit: ["&", key]
				}
			});
		}
	},
	check(chunk, criteria, data) {
		if (!isPlainObject(data)) {
			return ("TYPE_PLAIN_OBJECT_REQUIRED");
		}

		const keys = Reflect.ownKeys(data);
		if (!this.hasAcceptedKeys(criteria, keys)) {
			return ("DATA_KEYS_INVALID");
		}
		else if (!this.hasRequiredKeys(criteria, keys)) {
			return ("DATA_KEYS_MISSING");
		}

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			chunk.push({
				data: data[key],
				node: criteria.struct[key]
			});
		}

		return (null);
	}
}