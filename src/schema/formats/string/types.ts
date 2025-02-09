import { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria } from "../types";
import { testers } from "../../..";

type ExtractParams<T extends (input: any, params: any) => any> = 
	T extends (input: any, params: infer U) => any ? U : never;

type TestersString = typeof testers.string;

type Testers = {
	[K in keyof TestersString]: {
		name: K;
		params?: ExtractParams<TestersString[K]>;
	};
}[keyof TestersString];

export interface StringTunableCriteria extends TunableCriteriaTemplate<"string"> {
	min?: number;
	max?: number;
	/** @default true */
	empty?: boolean;
	enum?: string[] | Record<string | number, string>;
	regex?: RegExp;
	tester?: Testers;
	custom?: (value: string) => boolean;
}

export interface StringDefaultCriteria {
	empty: boolean;
}

export interface StringConcreteTypes extends ConcreteTypesTemplate<
	StringTunableCriteria,
	StringDefaultCriteria
> {}

type StringGuardedCriteria<T extends StringTunableCriteria> =
	T['enum'] extends string[]
		? T['empty'] extends true
			? T['enum'][number] | ""
			: T['enum'][number]
		: T['enum'] extends Record<string | number, string>
			? T['empty'] extends true
				? { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']] | ""
				: { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']]
			: string;

export interface StringGenericTypes<T extends StringTunableCriteria> extends GenericTypesTemplate<
	StringTunableCriteria,
	{},
	StringGuardedCriteria<T>
> {}
