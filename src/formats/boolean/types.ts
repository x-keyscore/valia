import { FormatsCriteria, GlobalCriteria } from "../types";

type FormatName = "boolean";

export interface BooleanCriteria extends GlobalCriteria {
	type: FormatName;
}

export type BooleanConcretTypes = {
	type: FormatName;
	criteria: BooleanCriteria;
	defaultCriteria: {};
	mountedCritetia: {};
}

type BooleanGuard<T extends FormatsCriteria> = T extends BooleanCriteria
	? boolean
	: never;

export type BooleanGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: BooleanGuard<T>;
}