import type { StructSetableCriteria, SetableStruct } from "./types";
import type { Format } from "../types";
import { isPlainObject } from "../../../testers";

function getRequiredKeys(
	optional: (string | symbol)[] | boolean,
	acceptedKeys: (string | symbol)[]
): (string | symbol)[] {
	if (optional === true) return ([]);
	if (optional === false) return ([...acceptedKeys]);
	return (acceptedKeys.filter(key => !optional.includes(key)));
}

function isShorthandStruct(obj: {}): obj is SetableStruct {
	return (isPlainObject(obj) && typeof obj?.type !== "string");
}

export const StructFormat: Format<StructSetableCriteria> = {
	type: "struct",
	mount(chunk, criteria) {
		const optional = criteria.optional ?? false;
		const additional = criteria.additional ?? false;
		const acceptedKeys = Reflect.ownKeys(criteria.struct);
		const requiredKeys = getRequiredKeys(optional, acceptedKeys);

		Object.assign(criteria, {
			optional: optional,
			additional: additional,
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

		if (typeof additional !== "boolean") {
			chunk.push({
				node: additional,
				partPaths: {
					explicit: ["additional"],
					implicit: []
				}
			});
		}
	},
	check(chunk, criteria, data) {
		if (!isPlainObject(data)) {
			return ("TYPE.PLAIN_OBJECT.NOT_SATISFIED");
		}

		const { acceptedKeys, requiredKeys, additional } = criteria;
		const definedKeys = Reflect.ownKeys(data),
			excessedKeys = [];

		if (definedKeys.length < requiredKeys.size) {
			return ("STRUCT.KEYS.NOT_SATISFIED");
		}

		let remainingRequiredKeys = requiredKeys.size;
		for (let i = definedKeys.length - 1; i >= 0; i--) {
			const key = definedKeys[i];

			if (requiredKeys.has(key)) {
				remainingRequiredKeys--;
			}
			else if (remainingRequiredKeys > i) {
				return ("STRUCT.KEYS.NOT_SATISFIED");
			}
			else if (!acceptedKeys.has(key)) {
				if (additional) {
					excessedKeys.push(key);
					continue;
				} else {
					return ("STRUCT.KEYS.NOT_SATISFIED");
				}
			}

			chunk.push({
				data: data[key],
				node: criteria.struct[key]
			});
		}

		if (remainingRequiredKeys) return ("STRUCT.KEYS.NOT_SATISFIED");

		if (excessedKeys.length && typeof additional !== "boolean") {
			const excessedProperties: Record<string | symbol, unknown> = {};

			for (let i = 0; i < excessedKeys.length; i++) {
				const key = excessedKeys[i];
				excessedProperties[key] = data[key];
			}

			chunk.push({
				data: excessedProperties,
				node: additional
			});
		}

		return (null);
	}
}