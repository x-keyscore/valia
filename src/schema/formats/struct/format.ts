import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructCriteria, StructTunableCriteria } from "./types";
import { isMountedCriteria } from "../../services/mounter";
import { isPlainObject } from "../../../testers";

interface CustomProperties {
	hasRequiredKeys(
		mountedCriteria: MountedCriteria<StructTunableCriteria>,
		value: (string | symbol)[]
	): boolean;
	hasAcceptedKeys(
		mountedCriteria: MountedCriteria<StructTunableCriteria>,
		value: (string | symbol)[]
	): boolean;
}

function isStructCriteria(obj: object): obj is StructCriteria {
	return (isPlainObject(obj) && typeof obj?.type !== "string");
}

export const StructFormat: FormatTemplate<StructTunableCriteria, CustomProperties> = {
	defaultCriteria: {},
	mounting(queue, mapper, definedCriteria, mountedCriteria) {
		const acceptedKeys = Reflect.ownKeys(definedCriteria.struct);
		const optionalKeys = acceptedKeys.filter(key => !definedCriteria?.optional?.includes(key));

		Object.assign(mountedCriteria, {
			acceptedKeys: acceptedKeys,
			requiredKeys: optionalKeys
		});

		for (let i = 0; i < acceptedKeys.length; i++) {
			const key = acceptedKeys[i];

			if (isMountedCriteria(definedCriteria.struct[key])) {
				mapper.merge(mountedCriteria, definedCriteria.struct[key], {
					pathParts: ["struct", key.toString()]
				});
				mountedCriteria.struct[key] = definedCriteria.struct[key];
			}
			else if (isStructCriteria(definedCriteria.struct[key]))
			{
				definedCriteria.struct[key] = {
					type: "struct",
					struct: definedCriteria.struct[key]
				}
				mapper.add(mountedCriteria, mountedCriteria.struct[key], {
					pathParts: ["struct", key.toString()]
				});
				queue.push({
					definedCriteria: definedCriteria.struct[key] ,
					mountedCriteria: mountedCriteria.struct[key]
				});
			}
			else
			{
				mapper.add(mountedCriteria, mountedCriteria.struct[key], {
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
	hasAcceptedKeys(mountedCriteria, inputKeys) {
		const definedKeys = mountedCriteria.acceptedKeys;
		return (inputKeys.length <= definedKeys.length && inputKeys.every((key) => definedKeys.includes(key)));
	},
	checking(queue, criteria, value) {
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
				criteria: criteria.struct[key],
				value: value[key]
			});
		}

		return (null);
	}
}