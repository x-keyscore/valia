import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface UnionSetableCriteria extends SetableCriteriaTemplate<"union"> {
    union: [SetableCriteria, ...SetableCriteria[]];
}
export interface UnionClassicTypes extends ClassicTypesTemplate<UnionSetableCriteria, {}> {
}
export interface UnionMountedCriteria {
    union: [MountedCriteria<SetableCriteria>, ...MountedCriteria<SetableCriteria>[]];
}
type UnionGuardedCriteria<T extends UnionSetableCriteria> = {
    [I in keyof T['union']]: T['union'][I] extends SetableCriteria ? GuardedCriteria<T['union'][I]> : never;
}[keyof T['union']];
export interface UnionGenericTypes<T extends UnionSetableCriteria> extends GenericTypesTemplate<UnionMountedCriteria, UnionGuardedCriteria<T>> {
}
export {};
