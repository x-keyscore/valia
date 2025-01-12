import { FormatsCriteria, FormatsGuard, GlobalCriteria, MountedCriteria } from "../types";

type FormatName = "array";

export interface ArrayCriteria extends GlobalCriteria {
	type: FormatName;
	item: FormatsCriteria;
	min?: number;
	max?: number;
	/**
	 * @default true
	 */
	empty?: boolean;
}

type DefaultArrayCriteria = {
	empty: boolean;
}

type MountedArrayCriteria = {
	item: MountedCriteria<FormatsCriteria>;
}

export type ArrayConcretTypes = {
	type: FormatName;
	criteria: ArrayCriteria;
	defaultCriteria: DefaultArrayCriteria;
	mountedCritetia: MountedArrayCriteria;
}

/**
 * The `ArrayGuard` type must represent the format type once it has been validated,
 * and must also tell us whether the current criteria type represented by `T`
 * is the one it should be. In this context `T` must be of type `ArrayCriteria`.
 * 
 * `ArrayCriteria` is always only called by the type `FormatGuard`,
 * which represents the root of the recursive loop of types.
 * 
 * @template T - The current criteria type of the recursive loop.
 */
type ArrayGuard<T extends FormatsCriteria> = T extends ArrayCriteria
	? FormatsGuard<T['item']>[]
	: never;

export type ArrayGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: ArrayGuard<T>;
}