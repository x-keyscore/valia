import { FormatsCriteria, GlobalCriteria } from "../types";
import { testers } from "../../";

type FormatName = "string";

type ExtractParams<T extends (arg1: any, arg2: any) => any> = 
  T extends (input: any, params: infer U) => boolean ? U : never;

type TestFunctions<Functions extends Record<string, (arg1: any, arg2: any) => any>> = {
	[K in keyof Functions]: {
		name: K,
		params?: ExtractParams<Functions[K]>
	};
}[keyof Functions];

export interface StringCriteria extends GlobalCriteria {
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

export interface DefaultStringCriteria {
	trim: boolean;
	empty: boolean;
}

export type StringConcretTypes = {
	type: FormatName;
	criteria: StringCriteria;
	defaultCriteria: DefaultStringCriteria;
	mountedCritetia: {};
}

type StringGuard<T extends FormatsCriteria> = T extends StringCriteria
	? string
	: never;

export type StringGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: StringGuard<T>;
}