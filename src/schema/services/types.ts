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

// MOUNTING

export interface MountingTask {
	node: SetableCriteria | MountedCriteria;
	partPaths: PathSegments;
	fullPaths: PathSegments;
}

export type MountingChunk = {
	node: SetableCriteria | MountedCriteria;
	partPaths: PathSegments;
}[];

// CHECKING

export interface CheckTask {
	data: unknown;
	node: MountedCriteria;
	fullPaths: PathSegments;
	listHooks?: CheckTaskHooks[];
}

export interface CheckTaskHooks {
	owner: CheckTask;
	callbacks: {
		onAccept(criteria: MountedCriteria): boolean | string;
		onReject(criteria: MountedCriteria, code: string): boolean | string;
	};
	awaitTasks: number;
	resetIndex: number;
}

export type CheckChunk = {
	data: CheckTask['data'];
	node: CheckTask['node'];
	hooks?: CheckTaskHooks['callbacks']
}[];

export interface CheckReject {
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
	path: PathSegments;
	type: string;
	label: string | undefined;
	message: string | undefined;
}