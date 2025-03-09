import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, KeyofFormatClassicTypes,
	SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";

type KeyCriteria = SetableCriteria<"string" | "symbol">;

export interface RecordSetableCriteria<
	T extends KeyofFormatClassicTypes = KeyofFormatClassicTypes
> extends SetableCriteriaTemplate<"record"> {
	empty?: boolean
	min?: number;
	max?: number;
	key: KeyCriteria;
	value: SetableCriteria<T>;
}

export interface RecordDefaultCriteria {
	empty: boolean;
}

export interface RecordClassicTypes<T extends KeyofFormatClassicTypes> extends ClassicTypesTemplate<
	RecordSetableCriteria<T>,
	RecordDefaultCriteria
> {}

export interface RecordMountedCriteria {
	key: MountedCriteria<KeyCriteria>;
	value: MountedCriteria;
}

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
