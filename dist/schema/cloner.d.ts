import type { VariantCriteria } from "../formats";
/**
 * Clones the object starting from the root and stops traversing a branch
 * when the `mountedMarker` symbol is encountered. In such cases, the object
 * containing the symbol is directly assigned to the corresponding node.
 *
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
export declare function cloner<T extends VariantCriteria>(src: T): T;
