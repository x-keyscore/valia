import type { RegistryKey, RegistryValue } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare function registryManager(this: SchemaInstance): {
    registry: Map<RegistryKey, RegistryValue>;
    /**
     * Add the criteria node in the registry.
     *
     * @param prevCriteria Previous criteria of `currCriteria` node.
     * @param currCriteria Current criteria added to the registry.
     * @param pathSegments Path segments of the `currCriteria` node.
     */
    set(prevCriteria: RegistryKey | null, currCriteria: RegistryKey, pathSegments: RegistryValue["pathSegments"]): void;
    /**
     * Junction of criteria mounted to unmounted.
     *
     * @param targetCriteria Target criteria of the junction.
     */
    junction(targetCriteria: MountedCriteria): void;
    getNextCriteria(criteria: RegistryKey): import("./types").RegistryPathSegments;
    /**
     * Composition of explicit path :
     * ```py
     * segment = (string / number / symbol)
     * path    = [*(...segment)]
     * ```
     *
     * Exemple :
     *  ```py
     * my-path = ["struct", "products", "item", "price"]
     * ```
     *
     * Composition of implicit path :
     * ```py
     * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
     * static-key    = ["&", (string / number / symbol)]
     * segment       = dynamic-key / static-key
     * path          = [1*(...segment)]
     * ```
     *
     * Exemple :
     * ```py
     * my-path = ["&", "products", "%", "number", "&", "price"]
     * my-path is products[0].price or products[1].price and continue
     * ```
     */
    getPathSegments(criteria: RegistryKey): import("./types").RegistryPathSegments;
};
