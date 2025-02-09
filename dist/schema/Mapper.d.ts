import type { MountedCriteria, TunableCriteria } from "./formats";
type ReferenceKey = MountedCriteria<TunableCriteria>;
interface ReferenceValue {
    prev: ReferenceKey | null;
    data: {
        pathParts: string[];
    };
}
export declare const mapperSymbol: unique symbol;
export declare class Mapper {
    references: Map<ReferenceKey, ReferenceValue>;
    constructor();
    /**
     * Add a new criteria node to the mapper.
     */
    add(prevCriteria: ReferenceKey | null, currCriteria: ReferenceKey, data: ReferenceValue['data']): void;
    /**
     * Merging an unmounted criteria node with a mounted criteria node.
     */
    merge(prevCriteria: ReferenceKey, currCriteria: ReferenceKey, data: ReferenceValue['data']): void;
    /**
     * @param criteria Reference of the criteria node for which you want to retrieve the path.
     * @param separator Character that separates the different parts of the path.
     * @returns The path
     */
    getPath(criteria: ReferenceKey, separator: string): string;
}
export type MapperInstance = InstanceType<typeof Mapper>;
export {};
