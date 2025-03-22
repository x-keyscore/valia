import type { SymbolSetableCriteria } from "./types";
import type { Format } from "../types";

export const SymbolFormat: Format<SymbolSetableCriteria> = {
	defaultCriteria: {},
	check(queue, criteria, data) {
		if (typeof data !== "symbol") {
			return "TYPE_NOT_SYMBOL";
		}
		else if (criteria.symbol !== undefined && data !== criteria.symbol) {
			return "DATA_INVALID_SYMBOL";
		}

		return (null);
	}
}
