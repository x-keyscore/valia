import type { SimpleSetableCriteria, SimpleTypes } from "./types";
import type { Format } from "../types";

export interface CustomProperties {
	bitflags: Record<SimpleTypes, number>
}

export const SimpleFormat: Format<SimpleSetableCriteria, CustomProperties> = {
	type: "simple",
	defaultCriteria: {},
	bitflags: {
		undefined: 1 << 0,
		nullish:   1 << 1,
		null:      1 << 2,
		unknown:   1 << 3,
		any:       1 << 4
	},
	mount(chunk, criteria) {
		Object.assign(criteria, {
			bitcode: this.bitflags[criteria.simple]
		});
	},
	check(chunk, criteria, value) {
		const { bitflags } = this, { bitcode } = criteria;

		if (bitcode & (bitflags.any | bitflags.unknown)) {
			return (null);
		}

		if (bitcode & bitflags.nullish && value != null) {
			return ("TYPE_NULLISH_REQUIRED");
		}
		else if (bitcode & bitflags.null && value !== null) {
			return ("TYPE_NULL_REQUIRED");
		}
		else if ((bitcode & bitflags.undefined) && value !== undefined) {
			return ("TYPE_UNDEFINED_REQUIRED");
		}

		return (null);
	}
}