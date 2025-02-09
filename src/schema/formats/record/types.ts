import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate,
	TunableCriteria, TunableCriteriaMap, MountedCriteria, GuardedCriteria } from "../types";

type KeyCriteria = TunableCriteriaMap["string" | "symbol"];

export interface RecordTunableCriteria extends TunableCriteriaTemplate<"record"> {
	empty?: boolean
	min?: number;
	max?: number;
	key: KeyCriteria;
	value: TunableCriteria
}

export interface RecordDefaultCriteria {
	empty: boolean;
}

export interface RecordMountedCriteria {
	key: MountedCriteria<KeyCriteria>;
	value: MountedCriteria<TunableCriteria>;
}

export interface RecordConcreteTypes extends ConcreteTypesTemplate<
	RecordTunableCriteria,
	RecordDefaultCriteria
> {}

type RecordGuardedCriteria<T extends RecordTunableCriteria> =
	GuardedCriteria<T['key']> extends infer U
		? U extends PropertyKey
			? { [P in U]?: GuardedCriteria<T['value']> }
			: never
		: never;

export interface RecordGenericTypes<T extends RecordTunableCriteria> extends GenericTypesTemplate<
	RecordTunableCriteria,
	RecordMountedCriteria,
	RecordGuardedCriteria<T>
> {}
