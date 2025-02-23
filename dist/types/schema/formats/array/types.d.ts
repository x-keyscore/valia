import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";
export interface ArraySetableCriteria extends SetableCriteriaTemplate<"array"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    item: SetableCriteria;
}
export interface ArrayDefaultCriteria {
    empty: boolean;
}
export interface ArrayClassicTypes extends ClassicTypesTemplate<ArraySetableCriteria, ArrayDefaultCriteria> {
}
export interface ArrayMountedCriteria {
    item: MountedCriteria;
}
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];
export interface ArrayGenericTypes<T extends ArraySetableCriteria> extends GenericTypesTemplate<ArrayMountedCriteria, ArrayGuardedCriteria<T>> {
}
export {};
