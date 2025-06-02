import type { SetableCriteriaTemplate, SpecTypesTemplate, FlowTypesTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanSpecTypes extends SpecTypesTemplate<
	BooleanSetableCriteria,
	{}
> {}

export interface BooleanFlowTypes extends FlowTypesTemplate<
	{},
	boolean
> {}