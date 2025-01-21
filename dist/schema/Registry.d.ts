import type { MountedCriteria, VariantCriteria } from "./formats";
type StorageKey = MountedCriteria<VariantCriteria>;
interface StorageValue {
    prev: StorageKey | null;
    data: {
        pathParts: string[];
        link?: string;
    };
}
export declare const registrySymbol: unique symbol;
export declare class Registry {
    storage: Map<StorageKey, StorageValue>;
    /**
     * Add a new criteria node to the registry.
     */
    add(prevCriteria: StorageKey | null, currCriteria: StorageKey, data: StorageValue['data']): void;
    /**
     * Merging an unmounted criteria node with a mounted criteria node.
     */
    merge(prevCriteria: StorageKey, currCriteria: StorageKey, data: StorageValue['data']): void;
    /**
     * @param criteria Reference of the criteria node for which you want to retrieve the path.
     * @param separator Character that separates the different parts of the path.
     * @returns The path
     */
    getPath(criteria: StorageKey, separator: string): string;
}
export type RegistryInstance = InstanceType<typeof Registry>;
export {};
