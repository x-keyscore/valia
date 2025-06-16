import type { SetableCriteriaTemplate, FlowTypesTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanFlowTypes extends FlowTypesTemplate<
	{},
	boolean
> {}