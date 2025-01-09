import { TemplateCriteria, TemplateContext } from "../types";
import { testers } from "../../";

export type ExtractParams<T extends (arg1: any, arg2: any) => any> = 
  T extends (input: any, params: infer U) => boolean ? U : never;

type TestFunctions<Functions extends Record<string, (arg1: any, arg2: any) => any>> = {
	[K in keyof Functions]: {
		name: K,
		params?: ExtractParams<Functions[K]>
	};
}[keyof Functions];

export interface StringCriteria extends TemplateCriteria {
	type: "string";
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
	test?: TestFunctions<typeof testers.string>;
	custom?: (input: string) => boolean;
}

type StringGuard = string;

export type StringContext = TemplateContext<
	StringCriteria,
	StringGuard,
	{
		trim: boolean;
		empty: boolean;
	},
	{}
>