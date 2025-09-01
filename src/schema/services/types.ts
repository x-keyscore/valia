import type { SetableCriteria, MountedCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";
import { SchemaDataRejection, SchemaDataAdmission } from "../utils";

export interface NodePath {
	/**
	 * #### Explanation :
	 * Array representing the path to the node in the criteria tree.
	 * 
	 * #### Composition :
	 * ```py
	 * segment = (string / number / symbol)
	 * path    = [*(...segment)]
	 * ```
	 * 
	 * #### Exemple :
	 *  ```py
	 * my-path = ["struct", "products", "item", "price"]
	 * ```
	*/
	explicit: (string | number | symbol)[];
	/**
	 * #### Explanation :
	 * Array representing the virtual path to the data represented by the node.
	 * 
	 * #### Composition :
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
	implicit: (LooseAutocomplete<"&" | "%" | "string" | "number" | "symbol"> | number | symbol)[];
}

// MOUNTER

export interface MounterTask {
	node: SetableCriteria | MountedCriteria;
	nodePath: NodePath;
	partPath: Partial<NodePath>;
	
}

export interface MounterChunkTask {
	node: SetableCriteria | MountedCriteria;
	partPath: Partial<NodePath>;
};

// CHECKER

export interface CheckerTask {
	data: unknown;
	node: MountedCriteria;
	nodePath: NodePath;
	/** The hook associated with this task or a descendant of the task */
	closerHook: CheckerHook | null;
}

/**
 * @template RejectionCodes
 * Strings representing possible rejection codes for the `“REJECT”` action.
 */
export interface CheckerChunkTaskHook<RejectionCodes extends string = string> {
	onReject(rejection: CheckerRejection): {
		action: "REJECT";
		code: RejectionCodes;
	} | {
		action: "CANCEL";
		target: "CHUNK" | "BRANCH";
	};
	onAccept(): {
		action: "REJECT";
		code: RejectionCodes;
	} | {
		action: "CANCEL";
		target: "CHUNK";
	};
}

export interface CheckerHook extends CheckerChunkTaskHook {
	/** Task that created (issued) this hook */
	sourceTask: CheckerTask;
	/** Index of the first task in the chunk that this hook’s sourceTask controls */
	chunkTaskIndex: number;
	/** Index of the specific task in the branch controlled by this hook’s sourceTask */
	branchTaskIndex: number;
	/** Index of the first hook in the chunk that this hook’s sourceTask controls */
	chunkHookIndex: number;
	/** Index of the specific hook in the branch controlled by this hook’s sourceTask */
	branchHookIndex: number;
}

export interface CheckerChunkTask {
	data: CheckerTask['data'];
	node: CheckerTask['node'];
	hook?: CheckerChunkTaskHook;
};

export type CheckerRejection = {
	issuerTask: CheckerTask;
	code: string;
};

export type CheckerResult<GuardedData = unknown> = {
	success: false;
	rejection: SchemaDataRejection;
	admission: null;
} | {
	success: true;
	rejection: null;
	admission: SchemaDataAdmission<GuardedData>;
};

export type CommonExceptionCodes =
	| "TYPE_PROPERTY_UNDEFINED"
	| "TYPE_PROPERTY_MISDECLARED"
	| "TYPE_PROPERTY_MISCONFIGURED"
	| "LABEL_PROPERTY_MISDECLARED"
	| "MESSAGE_PROPERTY_MISDECLARED";