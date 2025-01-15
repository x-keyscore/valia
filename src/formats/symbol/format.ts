import type { SymbolVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria } from "../formats";
import { isSymbol } from "../../testers";

export const SymbolFormat: FormatTemplate<SymbolVariantCriteria> = {
	defaultCriteria: {},
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, definedCriteria));
	},
	checkValue(criteria, value) {
		if (!isSymbol(value)) {
			return "TYPE_NOT_SYMBOL";
		}
		else if (criteria.symbol !== undefined && criteria.symbol === value) {
			return "VALUE_INVALID_SYMBOL";
		}

		return (null);
	}
}
