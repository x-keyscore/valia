import type { SymbolSetableCriteria, SymbolExceptionCodes, SymbolRejectionCodes } from "./types";
import type { Format } from "../types";
import { isPlainObject, isArray, isFunction } from "../../../testers";

export const SymbolFormat: Format<
	SymbolSetableCriteria,
	SymbolExceptionCodes,
	SymbolRejectionCodes
> = {
	type: "symbol",
	exceptions: {
		LITERAL_PROPERTY_MISDECLARED:
			"The 'literal' property must be of type symbol, array or plain object.",
		LITERAL_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'literal' property must have a number of items greater than 0.",
		LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED:
			"The array items of the 'literal' property must be of type symbol.",
		LITERAL_PROPERTY_OBJECT_MISCONFIGURED:
			"The object of the 'literal' property must must have a number of keys greater than 0.",
		LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED:
			"The object keys of the 'literal' property must be of type string.",
		LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED:
			"The object values of the 'literal' property must be of type symbol.",
		CUSTOM_PROPERTY_MISDECLARED:
            "The 'custom' property must be of type basic function."
	},
	mount(chunk, criteria) {
		const { literal, custom } = criteria;

		if (literal !== undefined) {
			let resolvedLiteral;

			if (typeof literal === "symbol") {
				resolvedLiteral = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "symbol") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED");
					}
				}

				resolvedLiteral = new Set(literal);
			} else if (isPlainObject(literal)) {
				const keys = Reflect.ownKeys(literal);
				if (keys.length < 1) {
					return ("LITERAL_PROPERTY_OBJECT_MISCONFIGURED");
				}

				for (const key of keys) {
					if (typeof key !== "string") {
						return ("LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED");
					}
					if (typeof literal[key] !== "symbol") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED");
					}
				}

				resolvedLiteral = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MISDECLARED");
			}

			Object.assign(criteria, { resolvedLiteral });
		}
		if (custom !== undefined && !isFunction(custom)) {
			return ("CUSTOM_PROPERTY_MISDECLARED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return ("TYPE_SYMBOL_UNSATISFIED");
		}

		const { resolvedLiteral, custom } = criteria;

		if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
			return ("LITERAL_UNSATISFIED");
		}
		if (custom && !custom(value)) {
			return ("CUSTOM_UNSATISFIED");
		}

		return (null);
	}
}
