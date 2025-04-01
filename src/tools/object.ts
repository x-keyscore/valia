import type { LooseAutocomplete } from "../types";
import type { StandardTags } from "./types";

export function hasTag(target: unknown, tag: LooseAutocomplete<StandardTags>): boolean {
	return (Object.prototype.toString.call(target).slice(8, -1) === tag);
}