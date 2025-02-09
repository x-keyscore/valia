import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface TupleTunableCriteria extends TunableCriteriaTemplate<"tuple"> {
    tuple: [TunableCriteria, ...TunableCriteria[]];
}
export interface TupleConcreteTypes extends ConcreteTypesTemplate<TupleTunableCriteria, {}> {
}
export interface TupleMountedCriteria {
    tuple: [MountedCriteria<TunableCriteria>, ...MountedCriteria<TunableCriteria>[]];
}
type TupleGuardedCriteria<T extends TupleTunableCriteria> = T['tuple'] extends infer U ? {
    [I in keyof U]: U[I] extends TunableCriteria ? GuardedCriteria<U[I]> : never;
} : never;
export interface TupleGenericTypes<T extends TupleTunableCriteria> extends GenericTypesTemplate<TupleTunableCriteria, TupleMountedCriteria, TupleGuardedCriteria<T>> {
}
export {};
