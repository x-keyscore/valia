import type { SetableCriteriaTemplate, SpecTypesTemplate, FlowTypesTemplate } from "../types";

export type SimpleTypes =
	| "undefined"
	| "nullish"
	| "null"
	| "unknown"
	| "any";

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: SimpleTypes;
}

export interface SimpleSpecTypes extends SpecTypesTemplate<
	SimpleSetableCriteria,
	{}
> {}

export interface SimpleMountedCriteria {
	bitcode: number;
}

type SimpleGuardedCriteria<T extends SimpleSetableCriteria> =
	T["simple"] extends "nullish"   ? undefined | null :
	T["simple"] extends "undefined" ? undefined :
	T["simple"] extends "null"      ? null :
	T["simple"] extends "unknown"   ? unknown :
    T["simple"] extends "any"       ? any :
    never;

export interface SimpleFlowTypes<T extends SimpleSetableCriteria> extends FlowTypesTemplate<
	SimpleMountedCriteria,
	SimpleGuardedCriteria<T>
> {}