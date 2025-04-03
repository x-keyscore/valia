import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, FormatGlobalNames, SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface UnionSetableCriteria<T extends FormatGlobalNames = FormatGlobalNames> extends SetableCriteriaTemplate<"union"> {
    union: [SetableCriteria<T>, SetableCriteria<T>, ...SetableCriteria<T>[]];
}
export interface UnionClassicTypes<T extends FormatGlobalNames> extends ClassicTypesTemplate<UnionSetableCriteria<T>, {}> {
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
