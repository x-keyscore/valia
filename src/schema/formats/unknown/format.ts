import type { UnknownSetableCriteria } from "./types";
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