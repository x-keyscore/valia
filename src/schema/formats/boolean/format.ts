import type { BooleanSetableCriteria } from "./types";
import type { Format } from "../types";

export const BooleanFormat: Format<BooleanSetableCriteria> = {
	type: "boolean",
	check(chunk, criteria, value) {
		if (typeof value !== "boolean") {
			return ("TYPE.BOOLEAN.NOT_SATISFIED");
		}

		return (null);
	},
}
