import type {
	SetableCriteriaTemplate,
	ClassicTypesTemplate,
	GenericTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	KeyofFormatClassicTypes
} from "../types";

export interface ArraySetableCriteria<
	T extends KeyofFormatClassicTypes = KeyofFormatClassicTypes
> extends SetableCriteriaTemplate<"array"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	item: SetableCriteria<T>;
}

export interface ArrayDefaultCriteria {
	empty: boolean;
}

export interface ArrayClassicTypes<T extends KeyofFormatClassicTypes> extends ClassicTypesTemplate<
	ArraySetableCriteria<T>,
	ArrayDefaultCriteria
> {}

export interface ArrayMountedCriteria {
	item: MountedCriteria;
}

type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];

export interface ArrayGenericTypes<T extends ArraySetableCriteria> extends GenericTypesTemplate<
	ArrayMountedCriteria,
	ArrayGuardedCriteria<T>
> {}