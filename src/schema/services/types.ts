import type { SetableCriteria, MountedCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";
import type { MountingChunk } from "./mounter";
import type { CheckingChunk } from "./checker";

type PathSegmentsImplicitSyntax = (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol);

/**
 * **Composition of implicit path :**
 * ```py
 * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
 * static-key    = ["&", (string / number / symbol)]
 * segment       = dynamic-key / static-key
 * path          = [1*(...segment)]
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

// MOUNTING

export interface MountingTask {
	node: SetableCriteria | MountedCriteria;
	partPaths: PathSegments;
	fullPaths: PathSegments;
}

export type MountingChunkInstance = InstanceType<typeof MountingChunk>;

// CHECKING

/**
 * @template U Custom members you want to add to the object.
 */
export type CheckingTaskHooks<U extends Record<string, any> = never> = {
	nodeAccepted?(criteria: MountedCriteria): boolean | string;
	nodeRejected?(criteria: MountedCriteria, reject: string | null): boolean | string;
	branchAccepted?(criteria: MountedCriteria): boolean | string;
	branchRejected?(criteria: MountedCriteria, reject: string | null): boolean | string;
} & U;

export interface CheckingTask {
	data: unknown;
	node: MountedCriteria;
	hooks?: CheckingTaskHooks;
	fullPaths: PathSegments;
}

export interface CheckingChunkHooks {
	childTasks: number;
	chunkHooks: { }[];
	
}

export type CheckingChunkInstance = InstanceType<typeof CheckingChunk>;

export interface CheckerReject {
	path: PathSegments;
	/**
	 * Error code structured as `<CATEGORY>_<DETAIL>`, where `<CATEGORY>` can be:
	 * 
	 * - `TYPE`: Indicates an error related to a data type (e.g., `TYPE_NOT_STRING`).
	 * - `DATA`: Indicates an error related to the provided data (e.g., `DATA_MISSING_KEY`).
	 * - `TEST`: Indicates an error related to a specific test or validation (e.g., `TEST_REGEX_FAILED`).
	 * 
	 * `<DETAIL>`: A specific description of the error, such as `NOT_STRING`, `MISSING_KEY`, etc.
	 */
	code: string;
	type: string;
	label: string | undefined;
	message: string | undefined;
}