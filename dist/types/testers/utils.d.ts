import { LooseAutocomplete } from "../types";
import { StandardTags } from "./types";
export declare function lazy<T extends object>(callback: () => T): () => T;
export declare function hasTag(x: unknown, tag: LooseAutocomplete<StandardTags>): boolean;
/**
 * @see https://www.garykessler.net/library/file_sigs.html
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 */
declare const signatures: ({
    ext: "png";
    offset: number;
    flags: string[];
} | {
    ext: "jpg";
    offset: number;
    flags: string[];
} | {
    ext: "jp2";
    offset: number;
    flags: string[];
} | {
    ext: "gif";
    offset: number;
    flags: string[];
} | {
    ext: "webp";
    offset: number;
    flags: string[];
} | {
    ext: "mp3";
    offset: number;
    flags: string[];
} | {
    ext: "mp4";
    offset: number;
    flags: string[];
} | {
    ext: "stl";
    offset: number;
    flags: string[];
})[];
export declare function hasFileSignature(hex: string, extensions: Array<(typeof signatures)[number]['ext']>): true | undefined;
export {};
