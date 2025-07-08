import type { LooseAutocomplete } from "../types";
import type { InternalTags } from "./types";

export function getInternalTag(target: unknown): LooseAutocomplete<InternalTags> {
	return (Object.prototype.toString.call(target).slice(8, -1));
}