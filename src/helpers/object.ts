import type { LooseAutocomplete } from "../types";
import type { StandardTags } from "./types";

export function getInternalTag(target: unknown): LooseAutocomplete<StandardTags> {
	return (Object.prototype.toString.call(target).slice(8, -1));
}