import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface ArrayTunableCriteria extends TunableCriteriaTemplate<"array"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    item: TunableCriteria;
}
export interface ArrayDefaultCriteria {
    empty: boolean;
}
export interface ArrayConcreteTypes extends ConcreteTypesTemplate<ArrayTunableCriteria, ArrayDefaultCriteria> {
}
export interface ArrayMountedCriteria {
    item: MountedCriteria<TunableCriteria>;
}
type ArrayGuardedCriteria<T extends ArrayTunableCriteria> = GuardedCriteria<T['item']>[];
export interface ArrayGenericTypes<T extends ArrayTunableCriteria> extends GenericTypesTemplate<ArrayTunableCriteria, ArrayMountedCriteria, ArrayGuardedCriteria<T>> {
}
export {};
