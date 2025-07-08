import type { SetableCriteria, MountedCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";

export interface NodePaths {
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

export interface MounterTask {
	node: SetableCriteria | MountedCriteria;
	partPaths: NodePaths;
	fullPaths: NodePaths;
}

export interface MounterChunkTask {
	node: SetableCriteria | MountedCriteria;
	partPaths: NodePaths;
};

export type MounterChunk = MounterChunkTask[];

// CHECKER

export interface CheckerHooks<R extends string = string,> {
	onAccept(): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK";
	} | {
		action: "REJECT";
		code: R;
	};
	onReject(reject: CheckerReject): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK" | "BRANCH";
	} | {
		action: "REJECT";
		code: R;
	};
}

export interface CheckerStackItemHooks extends CheckerHooks {
	owner: CheckerTask;
	index: {
		chunk: number;
		branch: number;
	};
}

export interface CheckerTask {
	data: unknown;
	node: MountedCriteria;
	fullPaths: NodePaths;
	stackHooks?: CheckerStackItemHooks[];
}

export interface CheckerChunkTask {
	data: CheckerTask['data'];
	node: CheckerTask['node'];
	hooks?: CheckerHooks;
};

export type CheckerChunk = CheckerChunkTask[];

export interface CheckerReject {
	path: NodePaths;
	/**
	 * Syntax: `<FORMAT>.<RULE>[.<DETAIL>].<REASON>`
	 *
	 * Components:
	 * - `<FORMAT>`    : The format involved (e.g. NUMBER, STRING, STRUCT)
	 * - `<MEMBER>`      : The criterion involved (e.g. EMPTY, MIN, ENUM)
	 * - `<DETAIL>`    : Specific detail or sub-aspect of the criteria (e.g. LENGTH, PATTERN)
	 * - `<REASON>`    : The reason for rejection (e.g. NOT_SATISFIED, NOT_ALLOWED)
	 */
	code: string;
	type: string;
	label: string | undefined;
	message: string | undefined;
}