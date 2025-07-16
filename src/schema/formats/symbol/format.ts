import type { SymbolSetableCriteria, SymbolErrorCodes, SymbolRejectCodes } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const SymbolFormat: Format<SymbolSetableCriteria, SymbolErrorCodes, SymbolRejectCodes> = {
	type: "symbol",
	errors: {
		LITERAL_PROPERTY_MALFORMED:
			"The 'literal' property must be of type Symbol, Array or Plain Object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must contain at least one item.",
		LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED:
			"The array items of the 'literal' property must be of type Symbol.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must contain at least one key.",
		LITERAL_PROPERTY_OBJECT_KEY_MALFORMED:
			"The object keys of the 'literal' property must be of type String.",
		LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED:
			"The object values of the 'literal' property must be of type Symbol.",
	},
	mount(chunk, criteria) {
		const { literal } = criteria;

		if (literal !== undefined) {
			let literalSet = undefined;

			if (typeof literal === "symbol") {
				literalSet = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "symbol") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
					}
				}

				literalSet = new Set(literal);
			} else if (isPlainObject(literal)) {
				const keys = Reflect.ownKeys(literal);
				if (keys.length < 1) {
					return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
				}

				for (const key of keys) {
					if (typeof key !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof literal[key] !== "symbol") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}

				literalSet = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MALFORMED");
			}

			Object.assign(criteria, { literalSet });
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return ("TYPE_SYMBOL_UNSATISFIED");
		}

		const { literalSet } = criteria;

		if (literalSet !== undefined && !literalSet.has(value)) {
			return ("LITERAL_UNSATISFIED");
		}

		return (null);
	}
}
