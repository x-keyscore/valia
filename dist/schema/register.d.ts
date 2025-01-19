import type { MountedCriteria, VariantCriteria } from "../formats";
type RegisterKey = MountedCriteria<VariantCriteria>;
interface RegisterValue {
    prev: RegisterKey | null;
    data: {
        pathParts: string[];
        link?: string;
    };
}
export declare class Register {
    storage: Map<RegisterKey, RegisterValue>;
    add(prevCriteria: RegisterKey | null, currCriteria: RegisterKey, data: RegisterValue['data']): void;
    merge(prevCriteria: RegisterKey, currCriteria: RegisterKey, data: RegisterValue['data']): void;
    getPath(criteria: RegisterKey, separator: string): string;
}
export {};
