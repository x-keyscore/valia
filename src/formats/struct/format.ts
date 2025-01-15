import type { SchemaMountingTask, SchemaCheckingTask } from "../../schema";
import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructVariantCriteria } from "./types";
import { formatDefaultCriteria, isAlreadyMounted } from "../formats";
import { isArray, isObject, isPlainObject } from "../../testers";

interface CustomProperty {
	hasRequiredKeys(
		mountedCriteria: MountedCriteria<StructVariantCriteria>,
		value: Record<string, unknown>
	): boolean;
	hasDefinedKeys(
		mountedCriteria: MountedCriteria<StructVariantCriteria>,
		value: Record<string, unknown>
	): boolean;
}

export const StructFormat: FormatTemplate<StructVariantCriteria, CustomProperty> = {
	defaultCriteria: {
		empty: false
	},
	hasRequiredKeys(mountedCriteria, value) {
		const requiredKeys = mountedCriteria.requiredKeys;
		const inputKeys = Object.keys(value);

		for (const key of requiredKeys) {
			if (!inputKeys.includes(key)) return (false)
		}
		return (true);
	},
	hasDefinedKeys(mountedCriteria, value) {
		const definedKeys = mountedCriteria.definedKeys;
		const inputKeys = Object.keys(value);

		for (const key of inputKeys) {
			if (!definedKeys.includes(key)) return (false)
		}
		return (true);
	},
	mountCriteria(definedCriteria, mountedCriteria) {
		const definedKeys = Object.keys(definedCriteria.struct);
		const optionalKeys = definedCriteria.optionalKeys;

		return (Object.assign(mountedCriteria, formatDefaultCriteria, this.defaultCriteria, definedCriteria, {
			definedKeys: Object.keys(definedCriteria.struct),
			requiredKeys: optionalKeys ? definedKeys.filter(key => !optionalKeys.includes(key)) : []
		}));
	},
	getMountingTasks(definedCriteria, mountedCriteria) {
		let mountingTasks: SchemaMountingTask[] = [];
		const keys = Object.keys(definedCriteria.struct);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			if (isArray(definedCriteria.struct[key])) return ([]);

			if (isAlreadyMounted(definedCriteria.struct[key])) {
				mountedCriteria.struct[key] = definedCriteria.struct[key];
			} else {
				mountingTasks.push({
					definedCriteria: definedCriteria.struct[key],
					mountedCriteria: mountedCriteria.struct[key]
				});
			}
		}

		return (mountingTasks);
	},
	checkValue(criteria, value) {
		if (!isObject(value)) {
			return ("TYPE_NOT_OBJECT");
		}
		else if (!isPlainObject(value)) {
			return ("TYPE_NOT_PLAIN_OBJECT");
		}
		else if (Object.keys(value).length === 0) {
			return (criteria.empty ? null : "VALUE_EMPTY");
		}
		else if (!this.hasRequiredKeys(criteria, value)) {
			return ("VALUE_MISSING_KEY");
		}
		else if (!this.hasDefinedKeys(criteria, value)) {
			return ("VALUE_INVALID_KEY");
		};

		return (null);
	},
	getCheckingTasks(criteria, value) {
		let checkingTasks: SchemaCheckingTask[] = [];
		const keys = Object.keys(value);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			checkingTasks.push({
				criteria: criteria.struct[key],
				value: value[key]
			});
		}

		return (checkingTasks);
	},
}