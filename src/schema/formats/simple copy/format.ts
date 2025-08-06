import type {
	UnknownSetableCriteria,
	NullSetableCriteria,
	NullRejectionCodes, 
	UndefinedSetableCriteria,
	UndefinedRejectionCodes
} from "./types";
import type { Format } from "../types";

export const UnknownFormat: Format<UnknownSetableCriteria> = {
	type: "unknown",
	exceptions: {},
	mount(chunk, criteria) {
		return (null);
	},
	check(chunk, criteria, value) {
		return (null);
	}
}

export const NullFormat: Format<NullSetableCriteria, never, NullRejectionCodes> = {
	type: "null",
	exceptions: {},
	mount(chunk, criteria) {
		return (null);
	},
	check(chunk, criteria, value) {
		if (value !== null) {
			return ("TYPE_NULL_UNSATISFIED");
		}

		return (null);
	}
}

export const UndefinedFormat: Format<UndefinedSetableCriteria, never, UndefinedRejectionCodes> = {
	type: "undefined",
	exceptions: {},
	mount(chunk, criteria) {
		return (null);
	},
	check(chunk, criteria, value) {
		if (value !== undefined) {
			return ("TYPE_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}