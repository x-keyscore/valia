import type { SetableCriteria, MountedCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";

export interface NodePath {
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
	implicit: (LooseAutocomplete<"&" | "%" | "string" | "number" | "symbol"> | number | symbol)[];
}

// MOUNTER

export interface MounterTask {
	node: SetableCriteria | MountedCriteria;
	partPath: Partial<NodePath>;
	fullPath: NodePath;
}

export interface MounterChunkTask {
	node: SetableCriteria | MountedCriteria;
	partPath: Partial<NodePath>;
};

export type MounterChunk = MounterChunkTask[];

// CHECKER

export interface CheckerHooks<R extends string = string> {
	onAccept(): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK";
	} | {
		action: "REJECT";
		code: R;
	};
	onReject(rejection: CheckerRejection): {
		action: "DEFAULT"
	} | {
		action: "IGNORE";
		target: "CHUNK" | "BRANCH";
	} | {
		action: "REJECT";
		code: R;
	};
}

export interface CheckerWrapHooks extends CheckerHooks {
	taskOwner: CheckerTask;
	stackIndex: {
		chunk: number;
		branch: number;
	};
}

export interface CheckerTask {
	data: unknown;
	node: MountedCriteria;
	fullPath: NodePath;
	stackHooks?: CheckerWrapHooks[];
}

export interface CheckerChunkTask {
	data: CheckerTask['data'];
	node: CheckerTask['node'];
	hooks?: CheckerHooks;
};

export type CheckerChunk = CheckerChunkTask[];

export interface CheckerRejection {
	code: string;
	task: CheckerTask;
}

// COMMON

export type CommonErrorCodes =
	| "NODE_MALFORMED"
	| "TYPE_PROPERTY_REQUIRED"
	| "TYPE_PROPERTY_MALFORMED"
	| "TYPE_PROPERTY_MISCONFIGURED"
	| "LABEL_PROPERTY_MALFORMED"
	| "MESSAGE_PROPERTY_MALFORMED"
	| "NULLABLE_PROPERTY_MALFORMED";