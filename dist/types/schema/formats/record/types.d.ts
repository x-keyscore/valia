import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, FormatGlobalNames, SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";
type KeyCriteria = SetableCriteria<"string" | "symbol">;
export interface RecordSetableCriteria<T extends FormatGlobalNames = FormatGlobalNames> extends SetableCriteriaTemplate<"record"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    key: KeyCriteria;
    value: SetableCriteria<T>;
}
export interface RecordDefaultCriteria {
    empty: boolean;
}
export interface RecordClassicTypes<T extends FormatGlobalNames> extends ClassicTypesTemplate<RecordSetableCriteria<T>, RecordDefaultCriteria> {
}
export interface RecordMountedCriteria {
    key: MountedCriteria<KeyCriteria>;
    value: MountedCriteria;
}
type RecordGuardedCriteria<T extends RecordSetableCriteria> = GuardedCriteria<T['key']> extends infer U ? U extends PropertyKey ? {
    [P in U]?: GuardedCriteria<T['value']>;
} : never : never;
export interface RecordGenericTypes<T extends RecordSetableCriteria> extends GenericTypesTemplate<RecordMountedCriteria, RecordGuardedCriteria<T>> {
}
export {};
