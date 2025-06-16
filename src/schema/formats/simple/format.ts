import type { SimpleSetableCriteria, SimpleTypes } from "./types";
import type { Format } from "../types";

export interface CustomProperties {
	bitflags: Record<SimpleTypes, number>
}

export const SimpleFormat: Format<SimpleSetableCriteria, CustomProperties> = {
	type: "simple",
	bitflags: {
		null:      1 << 0,
		undefined: 1 << 1,
		nullish:   1 << 2,
		unknown:   1 << 3
	},
	mount(chunk, criteria) {
		Object.assign(criteria, {
			bitcode: this.bitflags[criteria.simple]
		});
	},
	check(chunk, criteria, value) {
		const { bitflags } = this, { bitcode } = criteria;

		if (bitcode & bitflags.unknown) {
			return (null);
		}

		if (bitcode & bitflags.nullish && value != null) {
			return ("TYPE.NULLISH.NOT_SATISFIED");
		}
		else if (bitcode & bitflags.null && value !== null) {
			return ("TYPE.NULL.NOT_SATISFIED");
		}
		else if ((bitcode & bitflags.undefined) && value !== undefined) {
			return ("TYPE.UNDEFINED.NOT_SATISFIED");
		}

		return (null);
	}
}