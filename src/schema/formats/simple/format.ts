import type { SimpleSetableCriteria, SimpleTypes } from "./types";
import type { Format } from "../types";

const bitmask = {
    UNDEFINED: 1 << 0,
    UNKNOWN:   1 << 1,
    NULLISH:   1 << 2,
    NULL:      1 << 3,
    ANY:       1 << 4
}

export const SimpleFormat: Format<SimpleSetableCriteria> = {
	defaultCriteria: {},
	mount(chunk, criteria) {
		const bitmap: Record<SimpleTypes, number> = {
			"undefined": bitmask.UNDEFINED,
			"unknown":   bitmask.UNKNOWN,
			"nullish":   bitmask.NULLISH,
			"null":      bitmask.NULL,
			"any":       bitmask.ANY
		}

		Object.assign(criteria, {
			bitcode: bitmap[criteria.simple]
		});
	},
	check(chunk, criteria, value) {
		const { bitcode } = criteria;

		if (bitcode & ((1 << 1) | (1 << 4))) {
			return (null);
		}

		if (value === null) {
			if (!(bitcode & ((1 << 3) | (1 << 2)))) {
				return ("TYPE_NULL_DISALLOWED");
			}
		}
		else if (value === undefined) {
			if (!(bitcode & ((1 << 0) | (1 << 2)))) {
				return ("TYPE_UNDEFINED_DISALLOWED");
			}
		}

		return (null);
	}
}