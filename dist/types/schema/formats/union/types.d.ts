import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface UnionTunableCriteria extends TunableCriteriaTemplate<"union"> {
    union: [TunableCriteria, ...TunableCriteria[]];
}
export interface UnionMountedCriteria {
    union: [MountedCriteria<TunableCriteria>, ...MountedCriteria<TunableCriteria>[]];
}
export interface UnionConcreteTypes extends ConcreteTypesTemplate<UnionTunableCriteria, {}> {
}
type UnionGuardedCriteria<T extends UnionTunableCriteria> = {
    [I in keyof T['union']]: T['union'][I] extends TunableCriteria ? GuardedCriteria<T['union'][I]> : never;
}[keyof T['union']];
export interface UnionGenericTypes<T extends UnionTunableCriteria> extends GenericTypesTemplate<UnionTunableCriteria, UnionMountedCriteria, UnionGuardedCriteria<T>> {
}
export {};
