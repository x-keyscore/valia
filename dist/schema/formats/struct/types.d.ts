import type { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, VariantCriteria, FormatsGuard, MountedCriteria } from "../types";
export interface StructVariantCriteria extends VariantCriteriaTemplate<"struct"> {
    /** Array of optional keys */
    free?: (string | symbol)[];
    struct: Record<string | symbol, VariantCriteria>;
}
export interface StructMountedCriteria {
    struct: Record<string | symbol, MountedCriteria<VariantCriteria>>;
    validKeys: (string | symbol)[];
    requiredKeys: (string | symbol)[];
}
export interface StructConcreteTypes extends ConcreteTypesTemplate<StructVariantCriteria, {}, StructMountedCriteria> {
}
type OmitIndexDynamic<K extends PropertyKey> = {} extends Record<K, unknown> ? never : K;
type StructGuard<T extends VariantCriteria> = T extends StructVariantCriteria ? {
    -readonly [K in keyof T['struct'] as OmitIndexDynamic<K>]: FormatsGuard<T['struct'][K]>;
} : never;
export interface StructGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<StructVariantCriteria, StructGuard<T>> {
}
export {};
