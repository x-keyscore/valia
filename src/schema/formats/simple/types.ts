import type { SetableCriteriaTemplate, FlowTypesTemplate } from "../types";

export type SimpleTypes =
	| "null"
	| "undefined"
	| "nullish"
	| "unknown";

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: SimpleTypes;
}

export interface SimpleMountedCriteria {
	bitcode: number;
}

type SimpleGuardedCriteria<T extends SimpleSetableCriteria> =
	T["simple"] extends "null"      ? null :
	T["simple"] extends "undefined" ? undefined :
	T["simple"] extends "nullish"   ? undefined | null :
	T["simple"] extends "unknown"   ? unknown :
    never;

export interface SimpleFlowTypes<T extends SimpleSetableCriteria> extends FlowTypesTemplate<
	SimpleMountedCriteria,
	SimpleGuardedCriteria<T>
> {}