import type { SymbolSetableCriteria, SymbolErrorCodes, SymbolRejectCodes } from "./types";
import type { Format } from "../types";

export const SymbolFormat: Format<SymbolSetableCriteria, SymbolErrorCodes, SymbolRejectCodes> = {
	type: "symbol",
	errors: {
        LITERAL_PROPERTY_MALFORMED:
            "The 'literal' property must be of type Symbol."
    },
	mount(chunk, criteria) {
		const { literal } = criteria;

		if (literal !== undefined && typeof literal !== "symbol") {
			return ("LITERAL_PROPERTY_MALFORMED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return ("TYPE_SYMBOL_UNSATISFIED");
		}

		const { literal } = criteria;

		if (literal !== undefined && literal !== value) {
			return ("LITERAL_UNSATISFIED");
		}

		return (null);
	}
}
