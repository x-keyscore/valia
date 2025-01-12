import { FormatsCriteria, FormatsGuard, GlobalCriteria, MountedCriteria } from "../types";

type FormatName = "tuple";

export interface TupleCriteria extends GlobalCriteria {
	type: FormatName;
	min?: number;
	max?: number;
	/**
	 * @default true
	 */
	empty?: boolean;
	tuple: [FormatsCriteria, ...FormatsCriteria[]];
}

interface DefaultTupleCriteria {
	empty: boolean;
}

interface MountedTupleCriteria {
	tuple: [MountedCriteria<FormatsCriteria>, ...MountedCriteria<FormatsCriteria>[]];
}

export type TupleConcretTypes = {
	type: FormatName;
	criteria: TupleCriteria;
	defaultCriteria: DefaultTupleCriteria;
	mountedCritetia: MountedTupleCriteria;
}

type TupleGuard<T extends FormatsCriteria> = T extends TupleCriteria
	? { [I in keyof T['tuple']]: FormatsGuard<Extract<T['tuple'][I], FormatsCriteria>> }
	: never;

export type TupleGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: TupleGuard<T>;
}