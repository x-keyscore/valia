import type { SetableCriteria, MountedCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";

type PathSegmentsImplicitSyntax = (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol);

/**
 * **Composition of implicit path :**
 * ```py
 * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
 * static-key    = ["&", (string / number / symbol)]
 * segment       = dynamic-key / static-key
 * path          = [*(...segment)]
 * ```
 * 
 * **Exemple :**
 * ```py
 * my-path = ["&", "products", "%", "number", "&", "price"]
 * my-path is products[0].price or products[1].price and continue
 * ```
*/
type PathSegmentsImplicit = PathSegmentsImplicitSyntax[];

/**
 * **Composition of explicit path :**
 * ```py
 * segment = (string / number / symbol)
 * path    = [*(...segment)]
 * ```
 * 
 * **Exemple :**
 *  ```py
 * my-path = ["struct", "products", "item", "price"]
 * ```
*/
type PathSegmentsExplicit = (string | number | symbol)[];

export interface PathSegments {
	explicit: PathSegmentsExplicit;
	implicit: PathSegmentsImplicit;
}

// MOUNTER

export interface MountingTask {
	node: SetableCriteria | MountedCriteria;
	partPaths: PathSegments;
	fullPaths: PathSegments;
}

export type MountingChunk = {
	node: SetableCriteria | MountedCriteria;
	partPaths: PathSegments;
}[];

// CHECKER

export interface CheckingHooks {
	owner: CheckingTask;
	index: {
		chunk: number;
		branch: number;
	};
	onAccept(): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK";
	} | {
		action: "REJECT";
		code: string;
	};
	onReject(reject: CheckingReject): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK" | "BRANCH";
	} | {
		action: "REJECT";
		code: string;
	};
}

export interface CheckingTask {
	data: unknown;
	node: MountedCriteria;
	fullPaths: PathSegments;
	stackHooks?: CheckingHooks[];
}

export interface CheckingChunkTask {
	data: CheckingTask['data'];
	node: CheckingTask['node'];
	hooks?: Omit<CheckingHooks, "owner" | "index">;
};

export type CheckingChunk = CheckingChunkTask[];

export interface CheckingReject {
	path: PathSegments;
	/**
	 * Error code structured as `<CATEGORY>_<DETAIL>`, where `<CATEGORY>` can be:
	 * 
	 * - `TYPE`: Indicates an error related to a data type (e.g., `TYPE_STRING_REQUIRED`).
	 * - `DATA`: Indicates an error related to the provided data (e.g., `DATA_KEYS_MISSING`).
	 * - `TEST`: Indicates an error related to a specific test or validation (e.g., `TEST_REGEX_FAILED`).
	 * 
	 * `<DETAIL>`: A specific description of the error, such as `STRING_REQUIRED`, `KEYS_MISSING`, etc.
	 */
	code: string;
	type: string;
	label: string | undefined;
	message: string | undefined;
}