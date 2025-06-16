import type { SetableCriteria, MountedCriteria, formatNatives } from "../formats";
import type { LooseAutocomplete } from "../../types";

export interface PathSegments {
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
	explicit: (string | number | symbol)[];
	/**
	 * #### Composition of implicit path :
	 * ```py
	 * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
	 * static-key    = ["&", (string / number / symbol)]
	 * segment       = dynamic-key / static-key
	 * path          = [*(...segment)]
	 * ```
	 * 
	 * #### Exemple :
	 * ```py
	 * my-path = ["&", "products", "%", "number", "&", "price"]
	 * my-path is products[0].price or products[1].price and continue
	 * ```
	*/
	implicit: (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol)[];
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
	 * Syntax: `<FORMAT>.<RULE>[.<DETAIL>].<REASON>`
	 *
	 * Components:
	 * - `<FORMAT>`    : The format involved (e.g. NUMBER, STRING, STRUCT)
	 * - `<RULE>`      : The criterion involved (e.g. EMPTY, MIN, ENUM)
	 * - `<DETAIL>`    : Specific detail or sub-aspect of the criteria (e.g. LENGTH, PATTERN)
	 * - `<REASON>`    : The reason for rejection (e.g. NOT_SATISFIED, NOT_ALLOWED)
	 */
	code: string;
	type: string;
	label: string | undefined;
	message: string | undefined;
}