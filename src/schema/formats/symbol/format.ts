import type { SymbolSetableCriteria, SymbolExceptionCodes, SymbolRejectionCodes } from "./types";
import type { Format } from "../types";
import { isArray, isPlainObject } from "../../../testers";

export const SymbolFormat: Format<
	SymbolSetableCriteria,
	SymbolExceptionCodes,
	SymbolRejectionCodes
> = {
	type: "symbol",
	exceptions: {
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
			let resolvedLiteral;

			if (typeof literal === "symbol") {
				resolvedLiteral = new Set([literal]);
			} else if (isArray(literal)) {
				if (literal.length < 1) {
					return ("LITERAL_PROPERTY_ARRAY_MISCONFIGURED");
				}

				for (const item of literal) {
					if (typeof item !== "symbol") {
						return ("LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED");
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
						return ("LITERAL_PROPERTY_OBJECT_KEY_MALFORMED");
					}
					if (typeof literal[key] !== "symbol") {
						return ("LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED");
					}
				}

				resolvedLiteral = new Set(Object.values(literal));
			} else {
				return ("LITERAL_PROPERTY_MALFORMED");
			}

			Object.assign(criteria, { resolvedLiteral });
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return ("TYPE_SYMBOL_UNSATISFIED");
		}

		const { resolvedLiteral } = criteria;

		if (resolvedLiteral !== undefined && !resolvedLiteral.has(value)) {
			return ("LITERAL_UNSATISFIED");
		}

		return (null);
	}
}
