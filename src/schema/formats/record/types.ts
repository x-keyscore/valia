import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate,
	SetableCriteria, SetableCriteriaMap, MountedCriteria, GuardedCriteria } from "../types";

type KeySetableCriteria = SetableCriteriaMap["string" | "symbol"];

export interface RecordSetableCriteria extends SetableCriteriaTemplate<"record"> {
	empty?: boolean
	min?: number;
	max?: number;
	key: KeySetableCriteria;
	value: SetableCriteria
}

export interface RecordDefaultCriteria {
	empty: boolean;
}

export interface RecordMountedCriteria {
	key: MountedCriteria<KeySetableCriteria>;
	value: MountedCriteria;
}

export interface RecordClassicTypes extends ClassicTypesTemplate<
	RecordSetableCriteria,
	RecordDefaultCriteria
> {}

type RecordGuardedCriteria<T extends RecordSetableCriteria> =
	GuardedCriteria<T['key']> extends infer U
		? U extends PropertyKey
			? { [P in U]?: GuardedCriteria<T['value']> }
			: never
		: never;

export interface RecordGenericTypes<T extends RecordSetableCriteria> extends GenericTypesTemplate<
	RecordMountedCriteria,
	RecordGuardedCriteria<T>
> {}
