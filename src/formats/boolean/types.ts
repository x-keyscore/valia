import { TemplateCriteria, TemplateContext} from "../types";

export interface BooleanCriteria extends TemplateCriteria {
	type: "boolean";
}

type BooleanGuard = boolean;

export type BooleanContext = TemplateContext<
	BooleanCriteria,
	BooleanGuard,
	{},
	{}
>