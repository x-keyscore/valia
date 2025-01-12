import { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes, FormatsCriteria } from "../types";
import { testers } from "../../";

type ExtractParams<T extends (arg1: any, arg2: any) => any> = 
  T extends (input: any, params: infer U) => boolean ? U : never;

type TestFunctions<Functions extends Record<string, (arg1: any, arg2: any) => any>> = {
	[K in keyof Functions]: {
		name: K,
		params?: ExtractParams<Functions[K]>
	};
}[keyof Functions];

export interface StringCriteria extends TemplateCriteria<"string"> {
	min?: number;
	max?: number;
	/**
	 * @default false
	 */
	trim?: boolean;
	/**
	 * @default true
	 */
	empty?: boolean;
	regex?: RegExp;
	custom?: (input: string) => boolean;
	test?: TestFunctions<typeof testers.string>;
}

export interface DefaultStringCriteria {
	trim: boolean;
	empty: boolean;
}

export interface StringConcretTypes extends TemplateConcretTypes<
	StringCriteria,
	{
		trim: boolean;
		empty: boolean;
	},
	{}
> {}

type StringGuard<T extends FormatsCriteria> = T extends StringCriteria
	? string
	: never;

export interface StringGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	StringCriteria,
	StringGuard<T>
> {}