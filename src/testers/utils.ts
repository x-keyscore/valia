import { LooseAutocomplete } from "../types";
import { StandardTags } from "./types";

export function hasTag(x: unknown, tag: LooseAutocomplete<StandardTags>): boolean {
	return (Object.prototype.toString.call(x).slice(8, -1) === tag);
}

const supportWeakRef = typeof WeakRef !== 'undefined';
export function lazy<T extends object>(callback: () => T): () => T {
	let cache: any;
    return () => {
		if (supportWeakRef) {
			if (!cache?.deref()) {
				cache = new WeakRef(callback());
			}
			return (cache?.deref());
		} else if (!cache) {
			cache = callback();
		}
        return (cache);
    };
}
