import { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, FormatsGuard, MountedCriteria, VariantCriteria } from "../types";
export interface ArrayVariantCriteria extends VariantCriteriaTemplate<"array"> {
    /** @default true */
    empty?: boolean;
    min?: number;
    max?: number;
    item: VariantCriteria;
}
export interface ArrayDefaultCriteria {
    empty: boolean;
}
export interface ArrayMountedCriteria {
    item: MountedCriteria<VariantCriteria>;
}
export interface ArrayConcreteTypes extends ConcreteTypesTemplate<ArrayVariantCriteria, ArrayDefaultCriteria, ArrayMountedCriteria> {
}
/**
 * The `ArrayGuard` type must represent the format type once it has been validated,
 * and must also tell us whether the current criteria type represented by `T` is the
 * one it should be. In this context `T` must be of type `ArrayVariantCriteria`.
 *
 * `ArrayVariantCriteria` is always only called by the type `FormatGuard`,
 * which represents the root of the recursive loop of types.
 *
 * @template T - The current criteria type of the recursive loop.
 */
type ArrayGuard<T extends VariantCriteria> = T extends ArrayVariantCriteria ? FormatsGuard<T['item']>[] : never;
export interface ArrayGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<ArrayVariantCriteria, ArrayGuard<T>> {
}
export {};
