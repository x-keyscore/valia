import type { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, VariantCriteria, VariantCriteriaMap, FormatsGuard, MountedCriteria } from "../types";
type RecordVariantCriteriaKeys = VariantCriteriaMap["string" | "symbol"];
export interface RecordVariantCriteria extends VariantCriteriaTemplate<"record"> {
    key: RecordVariantCriteriaKeys;
    value: VariantCriteria;
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
}
export interface RecordDefaultCriteria {
    empty: boolean;
}
export interface RecordMountedCriteria {
    key: MountedCriteria<RecordVariantCriteriaKeys>;
    value: MountedCriteria<VariantCriteria>;
}
export interface RecordConcreteTypes extends ConcreteTypesTemplate<RecordVariantCriteria, RecordDefaultCriteria, RecordMountedCriteria> {
}
type RecordGuard<T extends VariantCriteria> = T extends RecordVariantCriteria ? FormatsGuard<T['key']> extends infer U ? U extends PropertyKey ? {
    [P in U]: FormatsGuard<T['value']>;
} : never : never : never;
export interface RecordGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<RecordVariantCriteria, RecordGuard<T>> {
}
export {};
