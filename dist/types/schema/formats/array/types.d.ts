import type { SetableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";
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
export interface ArrayConcreteTypes extends ConcreteTypesTemplate<ArraySetableCriteria, ArrayDefaultCriteria> {
}
export interface ArrayMountedCriteria {
    item: MountedCriteria<SetableCriteria>;
}
type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];
export interface ArrayGenericTypes<T extends ArraySetableCriteria> extends GenericTypesTemplate<ArraySetableCriteria, ArrayMountedCriteria, ArrayGuardedCriteria<T>> {
}
export {};
