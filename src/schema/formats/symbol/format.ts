import type { SymbolSetableCriteria } from "./types";
import type { Format } from "../types";

export const SymbolFormat: Format<SymbolSetableCriteria> = {
	type: "symbol",
	check(chunk, criteria, value) {
		if (typeof value !== "symbol") {
			return "TYPE.SYMBOL.NOT_SATISFIED";
		}
		else if (criteria.symbol && value !== criteria.symbol) {
			return "SYMBOL.NOT_ALLOWED";
		}

		return (null);
	}
}
