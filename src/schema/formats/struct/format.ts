import type { StructSetableCriteria, SetableStruct } from "./types";
import type { Format } from "../types";
import { isPlainObject } from "../../../tests";

function isShorthandStruct(obj: {}): obj is SetableStruct {
	return (isPlainObject(obj) && typeof obj?.type !== "string");
}

export const StructFormat: Format<StructSetableCriteria> = {
	type: "struct",
	defaultCriteria: {},
	mount(chunk, criteria) {
		const optionalKeys = criteria.optional;
		const acceptedKeys = Reflect.ownKeys(criteria.struct);
		const requiredKeys = acceptedKeys.filter(key => !optionalKeys?.includes(key));

		Object.assign(criteria, {
			acceptedKeys: new Set(acceptedKeys),
			requiredKeys: new Set(requiredKeys)
		});

		for (const key of acceptedKeys) {
			let value = criteria.struct[key];

			if (isShorthandStruct(value)) {
				value = {
					type: "struct",
					struct: value
				}
				criteria.struct[key] = value;
			}

			chunk.push({
				node: value,
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

		const { acceptedKeys, requiredKeys } = criteria;
		const keys = Reflect.ownKeys(data);

		if (keys.length < requiredKeys.size) {
			return ("DATA_KEYS_MISSING");
		}

		let requiredLeft = requiredKeys.size;
		for (let i = keys.length - 1; i >= 0; i--) {
			const key = keys[i];

			if (!acceptedKeys.has(key)) {
				return ("DATA_KEYS_INVALID");
			}

			if (requiredKeys.has(key)) {
				requiredLeft--;
			} else if (requiredLeft > i) {
				return ("DATA_KEYS_MISSING");
			}

			chunk.push({
				data: data[key],
				node: criteria.struct[key]
			});
		}

		return (null);
	}
}