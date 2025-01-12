import { GlobalCriteria, FormatsCriteria } from "../types";

type FormatName = "number";

export interface NumberCriteria extends GlobalCriteria {
	type: FormatName;
	min?: number;
	max?: number;
}

export type NumberConcretTypes = {
	type: FormatName;
	criteria: NumberCriteria;
	defaultCriteria: {};
	mountedCritetia: {};
}

type NumberGuard<T extends FormatsCriteria> = T extends NumberCriteria
	? number
	: never;

export type NumberGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: NumberGuard<T>;
}