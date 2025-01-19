import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructVariantCriteria } from "./types";
import { isMountedCriteria } from "../../schema";
import { isPlainObject } from "../../testers";

interface CustomProperties {
	hasRequiredKeys(
		mountedCriteria: MountedCriteria<StructVariantCriteria>,
		value: (string | symbol)[]
	): boolean;
	hasValidKeys(
		mountedCriteria: MountedCriteria<StructVariantCriteria>,
		value: (string | symbol)[]
	): boolean;
}

export const StructFormat: FormatTemplate<StructVariantCriteria, CustomProperties> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, register, definedCriteria, mountedCriteria) {
		const validKeys = [
			...Object.keys(definedCriteria.struct),
			...Object.getOwnPropertySymbols(definedCriteria.struct)
		];
		const optionalKeys = definedCriteria.optionalKeys;

		Object.assign(mountedCriteria, {
			validKeys: validKeys,
			requiredKeys: optionalKeys ? validKeys.filter(key => !optionalKeys.includes(key)) : validKeys
		});

		for (let i = 0; i < validKeys.length; i++) {
			const key = validKeys[i];

			if (isMountedCriteria(definedCriteria.struct[key])) {
				register.merge(mountedCriteria, definedCriteria.struct[key], {
					pathParts: ["struct", key.toString()]
				});
				mountedCriteria.struct[key] = definedCriteria.struct[key];
			} else {
				register.add(mountedCriteria, mountedCriteria.struct[key], {
					pathParts: ["struct", key.toString()]
				});
				queue.push({
					definedCriteria: definedCriteria.struct[key],
					mountedCriteria: mountedCriteria.struct[key]
				});
			}
		}
	},
	hasRequiredKeys(mountedCriteria, inputKeys) {
		const requiredKeys = mountedCriteria.requiredKeys;
		return (requiredKeys.length <= inputKeys.length && requiredKeys.every((key) => inputKeys.includes(key)));
	},
	hasValidKeys(mountedCriteria, inputKeys) {
		const definedKeys = mountedCriteria.validKeys;
		return (definedKeys.length === inputKeys.length && definedKeys.every((key, index) => key === inputKeys[index]));
	},
	checking(queue, criteria, value) {
		if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const keys = Object.keys(value);

		if (keys.length === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (!this.hasRequiredKeys(criteria, keys)) {
			return ("VALUE_MISSING_KEY");
		}
		else if (!this.hasValidKeys(criteria, keys)) {
			return ("VALUE_INVALID_KEY");
		};

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			queue.push({
				criteria: criteria.struct[key],
				value: value[key]
			});
		}

		return (null);
	}
}