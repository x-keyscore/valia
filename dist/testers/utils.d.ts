import { LooseAutocomplete } from "../types";
import { StandardTags } from "./types";
export declare function hasTag(x: unknown, tag: LooseAutocomplete<StandardTags>): boolean;
export declare function lazy<T extends object>(callback: () => T): () => T;
