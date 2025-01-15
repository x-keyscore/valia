import type { BooleanVariantCriteria } from "./types";
import type { FormatTemplate } from "../types";
import { formatDefaultCriteria } from "../formats";
import { isBoolean } from "../../testers";

export const BooleanFormat: FormatTemplate<BooleanVariantCriteria> = {
	mountCriteria(definedCriteria, mountedCriteria) {
		return (Object.assign(mountedCriteria, formatDefaultCriteria, definedCriteria));
	},
	checkValue(criteria, value) {
		if (!isBoolean(value)) {
			return ("TYPE_NOT_BOOLEAN");
		}

		return (null);
	}
}
