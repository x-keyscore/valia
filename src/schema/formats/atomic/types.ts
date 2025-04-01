import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export type AtomicTypes =
	| "undefined"
	| "unknown"
	| "nullish"
	| "null"
	| "any";

export interface AtomicSetableCriteria extends SetableCriteriaTemplate<"atomic"> {
	atomic: AtomicTypes;
}

export interface AtomicClassicTypes extends ClassicTypesTemplate<
	AtomicSetableCriteria,
	{}
> {}

export interface AtomicMountedCriteria {
	bitcode: number;
}

type AtomicGuardedCriteria<T extends AtomicSetableCriteria> = 
    T["atomic"] extends "undefined"   ? undefined :
    T["atomic"] extends "unknown"     ? unknown :
    T["atomic"] extends "nullish"     ? null | undefined :
    T["atomic"] extends "null"        ? null :
    T["atomic"] extends "any"         ? any :
    never;

export interface AtomicGenericTypes<T extends AtomicSetableCriteria> extends GenericTypesTemplate<
	AtomicMountedCriteria,
	AtomicGuardedCriteria<T>
> {}