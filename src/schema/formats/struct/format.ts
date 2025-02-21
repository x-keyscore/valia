import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructSetableCriteria, SetableStruct } from "./types";
import { isPlainObject } from "../../../testers";

interface CustomProperties {
	hasRequiredKeys(
		mountedCriteria: MountedCriteria<StructSetableCriteria>,
		value: (string | symbol)[]
	): boolean;
	hasAcceptedKeys(
		mountedCriteria: MountedCriteria<StructSetableCriteria>,
		value: (string | symbol)[]
	): boolean;
}

function isSubStruct(obj: object): obj is SetableStruct {
	return (isPlainObject(obj) && typeof obj?.type !== "string");
}

export const StructFormat: FormatTemplate<StructSetableCriteria, CustomProperties> = {
	defaultCriteria: {},
	mounting(queue, path, criteria) {
		const acceptedKeys = Reflect.ownKeys(criteria.struct);
		const requiredKeys = acceptedKeys.filter(key => !criteria?.optional?.includes(key));

		Object.assign(criteria, { acceptedKeys, requiredKeys });

		for (let i = 0; i < acceptedKeys.length; i++) {
			const key = acceptedKeys[i];

			if (isSubStruct(criteria.struct[key])) {
				criteria.struct[key] = {
					type: "struct",
					struct: criteria.struct[key]
				}
			}

			queue.push({
				prevCriteria: criteria,
				prevPath: path,
				criteria: criteria.struct[key],
				pathSegments: {
					explicit: ["struct", key],
					implicit: ["&", key]
				}
			});
		}
	},
	hasRequiredKeys(criteria, keys) {
		const requiredKeys = criteria.requiredKeys;
		return (requiredKeys.length <= keys.length && requiredKeys.every((key) => keys.includes(key)));
	},
	hasAcceptedKeys(criteria, keys) {
		const acceptedKeys = criteria.acceptedKeys;
		return (keys.length <= acceptedKeys.length && keys.every((key) => acceptedKeys.includes(key)));
	},
	checking(queue, path, criteria, value) {
		if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const keys = Reflect.ownKeys(value);
		if (!this.hasAcceptedKeys(criteria, keys)) {
			return ("VALUE_INVALID_KEY");
		}
		else if (!this.hasRequiredKeys(criteria, keys)) {
			return ("VALUE_MISSING_KEY");
		}

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			queue.push({
				prevPath: path,
				criteria: criteria.struct[key],
				value: value[key],
			});
		}

		return (null);
	}
}