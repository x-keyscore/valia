import type { SetableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, SetableCriteria, SetableCriteriaMap, MountedCriteria, GuardedCriteria } from "../types";
type KeyCriteria = SetableCriteriaMap["string" | "symbol"];
export interface RecordSetableCriteria extends SetableCriteriaTemplate<"record"> {
    empty?: boolean;
    min?: number;
    max?: number;
    key: KeyCriteria;
    value: SetableCriteria;
}
export interface RecordDefaultCriteria {
    empty: boolean;
}
export interface RecordMountedCriteria {
    key: MountedCriteria<KeyCriteria>;
    value: MountedCriteria<SetableCriteria>;
}
export interface RecordConcreteTypes extends ConcreteTypesTemplate<RecordSetableCriteria, RecordDefaultCriteria> {
}
type RecordGuardedCriteria<T extends RecordSetableCriteria> = GuardedCriteria<T['key']> extends infer U ? U extends PropertyKey ? {
    [P in U]?: GuardedCriteria<T['value']>;
} : never : never;
export interface RecordGenericTypes<T extends RecordSetableCriteria> extends GenericTypesTemplate<RecordSetableCriteria, RecordMountedCriteria, RecordGuardedCriteria<T>> {
}
export {};
