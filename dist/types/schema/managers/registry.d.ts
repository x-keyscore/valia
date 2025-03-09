import type { RegistryKey, RegistryValue } from "./types";
import type { MountedCriteria } from "../formats";
export declare function registryManager(): {
    registry: Map<RegistryKey, RegistryValue>;
    /**
     * Add the criteria node in the registry.
     *
     * @param prevCriteria Previous criteria of `currCriteria` node.
     * @param currCriteria Current criteria added to the registry.
     * @param pathSegments Path segments of the `currCriteria` node.
     */
    set(prevNode: RegistryKey | null, currNode: RegistryKey, partPaths: RegistryValue["partPaths"]): void;
    junction(targetNode: MountedCriteria): void;
    getNextNodes(criteria: RegistryKey): Set<RegistryKey>;
    /**
     * **Composition of explicit path :**
     * ```py
     * segment = (string / number / symbol)
     * path    = [*(...segment)]
     * ```
     *
     * **Exemple :**
     *  ```py
     * my-path = ["struct", "products", "item", "price"]
     * ```
     *
     * **Composition of implicit path :**
     * ```py
     * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
     * static-key    = ["&", (string / number / symbol)]
     * segment       = dynamic-key / static-key
     * path          = [1*(...segment)]
     * ```
     *
     * **Exemple :**
     * ```py
     * my-path = ["&", "products", "%", "number", "&", "price"]
     * my-path is products[0].price or products[1].price and continue
     * ```
     */
    getPartPaths(criteria: RegistryKey): {
        explicit: (string | number | symbol)[];
        implicit: (number | symbol | import("../../types").LooseAutocomplete<"string" | "number" | "symbol" | "@" | "&" | "%">)[];
    };
};
