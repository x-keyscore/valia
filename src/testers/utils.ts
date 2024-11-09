import { LooseAutocomplete } from "../types";
import { StandardTags } from "./types";

export function hasTag(x: unknown, tag: LooseAutocomplete<StandardTags>): boolean {
	return (Object.prototype.toString.call(x).slice(8, -1) === tag);
}