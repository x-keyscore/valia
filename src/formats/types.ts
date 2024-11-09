import type { ArrayContext, ArrayCriteria } from "./array/array";
import type { NumberCriteria, NumberContext } from "./number/number";
import type { RecordCriteria, RecordContext } from "./record/record";
import type { StringCriteria, StringContext } from "./string/string";
import { formats } from "./formats";

type ConstructorFirstArgType<T> = T extends new (first: infer F, ...args: any[]) => any ? F : never;

// FORMAT Criteria

/**
 * @template T Type name
 */
export interface TemplateCriteria<T extends string> {
	type: T;
	/**
	 * @default true
	 */
	require?: boolean;
	label?: string;
}

// FORMAT Context

/**
 * @template T Criteria type
 * @template U Guard type
 * @template V (Optional) Predefined criteria
 */
export type TemplateContext<
	T extends FormatsCriteria,
	U,
	V extends Exclude<keyof T, keyof TemplateCriteria<T['type']>> = never
> = {
	type: T['type'];
	guard: U;
	predefinedCriteria: Required<Pick<T, V>>;
}

export type FormatsContext<T extends FormatsCriteria> =
	| RecordContext<T>
	| ArrayContext<T>
	| StringContext
	| NumberContext;

export type FormatsContextByCriteria<T extends FormatsCriteria> = {
	[U in FormatsContext<T>['type']]: Extract<FormatsContext<T>, { type: U }>
}[T['type']];

// FORMAT Predefinable Criteria

export type PredefinedCriteria<T extends FormatsCriteria> = NonNullable<FormatsContextByCriteria<T>['predefinedCriteria']>;

// FORMAT

export interface FormatCheckerResult {
	error: {
		code: string;
	} | null
}

export type Formats = typeof formats[keyof typeof formats];

export type FormatsInstance = InstanceType<Formats>;

export type FormatsCriteria = ConstructorFirstArgType<Formats>

export type FormatsCriteriaTypeMap = {
	[T in FormatsCriteria['type']]: Extract<FormatsCriteria, { type: T }>
};

// FORMAT Guard

type FormatGuardDiscern<T extends FormatsCriteria> = FormatsContextByCriteria<T>['guard'];

export type FormatGuard<T extends FormatsCriteria> =
	T['require'] extends false
		? FormatGuardDiscern<T> | undefined
		: NonNullable<FormatGuardDiscern<T>>;

