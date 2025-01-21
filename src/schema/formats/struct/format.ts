import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructVariantCriteria } from "./types";
import { isMountedCriteria } from "../../mounter";
import { isPlainObject } from "../../../testers";

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
	defaultCriteria: {},
	mounting(queue, register, definedCriteria, mountedCriteria) {
		const validKeys = Reflect.ownKeys(definedCriteria.struct);
		const freeKeys = definedCriteria.free;

		Object.assign(mountedCriteria, {
			validKeys: validKeys,
			requiredKeys: freeKeys ? validKeys.filter(key => !freeKeys.includes(key)) : validKeys
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
		return (inputKeys.length <= definedKeys.length && inputKeys.every((key) => definedKeys.includes(key)));
	},
	checking(queue, criteria, value) {
		if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}

		const keys = Reflect.ownKeys(value);
		if (!this.hasValidKeys(criteria, keys)) {
			return ("VALUE_INVALID_KEY");
		}
		else if (!this.hasRequiredKeys(criteria, keys)) {
			return ("VALUE_MISSING_KEY");
		}

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