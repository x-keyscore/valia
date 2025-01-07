import { LooseAutocomplete } from "../types";
import { StandardTags } from "./types";
export declare function hasTag(x: unknown, tag: LooseAutocomplete<StandardTags>): boolean;
export declare function createUTF16UnitArray(str: string): Uint16Array;
export declare function getUTF8ByteLengthFromUTF16UnitArray(unitArray: Uint16Array): number;
