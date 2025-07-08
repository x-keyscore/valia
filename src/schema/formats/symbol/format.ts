import type { SymbolSetableCriteria, SymbolErrors, SymbolRejects } from "./types";
import type { Format } from "../types";

export const SymbolFormat: Format<SymbolSetableCriteria, SymbolErrors, SymbolRejects> = {
	type: "symbol",
	errors: {
        SYMBOL_PROPERTY_MALFORMED:
            "The 'symbol' property must be of type Symbol."
    },
	mount(chunk, criteria) {
		if (criteria.symbol !== undefined && typeof criteria.symbol !== "symbol") {
			return ("SYMBOL_PROPERTY_MALFORMED");
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return ("TYPE_SYMBOL_UNSATISFIED");
		}
		else if (criteria.symbol && value !== criteria.symbol) {
			return ("SYMBOL_UNSATISFIED");
		}

		return (null);
	}
}
