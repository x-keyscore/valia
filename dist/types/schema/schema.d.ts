import type { SetableCriteria, MountedCriteria, GuardedCriteria, SetableCriteriaMap, SetableCriteriaNative } from "./formats";
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export declare class Schema<const T extends SetableCriteria = SetableCriteriaMap[SetableCriteriaNative]> {
    private mountedCriteria;
    protected managers: {
        registry: {
            registry: Map<import("./managers").RegistryKey, import("./managers").RegistryValue>;
            set(prevNode: import("./managers").RegistryKey | null, currNode: import("./managers").RegistryKey, partPaths: import("./managers").RegistryValue["partPaths"]): void;
            junction(targetNode: MountedCriteria): void;
            getNextNodes(criteria: import("./managers").RegistryKey): {
                explicit: (string | number | symbol)[];
                implicit: (number | symbol | import("../types").LooseAutocomplete<"string" | "number" | "symbol" | "@" | "&" | "%">)[];
            };
            getPartPaths(criteria: import("./managers").RegistryKey): {
                explicit: (string | number | symbol)[];
                implicit: (number | symbol | import("../types").LooseAutocomplete<"string" | "number" | "symbol" | "@" | "&" | "%">)[];
            };
        };
        events: {
            listeners: Map<keyof import("./managers/types").Events, ((...args: any[]) => any)[]>;
            on<K extends keyof import("./managers/types").Events>(event: K, callback: import("./managers/types").Events[K]): void;
            emit<K extends keyof import("./managers/types").Events>(event: K, ...args: Parameters<import("./managers/types").Events[K]>): void;
            off<K extends keyof import("./managers/types").Events>(event: K, callback: import("./managers/types").Events[K]): void;
        };
    };
    protected initiate(definedCriteria: T): void;
    constructor(criteria: T);
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria(): MountedCriteria<T>;
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(value: unknown): value is GuardedCriteria<T>;
    /**
     * Evaluates the provided data against the schema.
     *
     * @param value - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(value: unknown): {
        reject: null;
        value: GuardedCriteria<T>;
    } | {
        reject: import("./services").Reject;
        value: null;
    };
}
