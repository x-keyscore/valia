import type { SetableCriteria, MountedCriteria, GuardedCriteria, NativeFormats } from "./formats";
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export declare class Schema<const T extends SetableCriteria = SetableCriteria<keyof NativeFormats>> {
    private mountedCriteria;
    protected managers: {
        registry: {
            registry: Map<import("./managers").RegistryKey, import("./managers").RegistryValue>;
            set(prevNode: import("./managers").RegistryKey | null, currNode: import("./managers").RegistryKey, partPaths: import("./managers").RegistryValue["partPaths"]): void;
            junction(targetNode: MountedCriteria): void;
            getNextNodes(criteria: import("./managers").RegistryKey): Set<import("./managers").RegistryKey>;
            getPartPaths(criteria: import("./managers").RegistryKey): {
                explicit: (string | number | symbol)[];
                implicit: (number | symbol | import("../types").LooseAutocomplete<"string" | "number" | "symbol" | "@" | "&" | "%">)[];
            };
        };
        formats: {
            formats: Map<string, {
                defaultCriteria: {} | import("./formats/array/types").ArrayDefaultCriteria | import("./formats/string/types").StringDefaultCriteria | import("./formats/record/types").RecordDefaultCriteria;
                mounting?(queue: import("./services").MountingTask[], path: import("./managers").RegistryValue["partPaths"], criteria: import("./formats/string/types").StringSetableCriteria | import("./formats/number/types").NumberSetableCriteria | import("./formats/boolean/types").BooleanSetableCriteria | import("./formats/symbol/types").SymbolSetableCriteria | import("./formats/array/types").ArraySetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/record/types").RecordSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/tuple/types").TupleSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/union/types").UnionSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>): void;
                checking(queue: import("./services").CheckingTask[], path: import("./managers").RegistryValue["partPaths"], criteria: (import("./formats/types").StaticDefaultCriteria & import("./formats/string/types").StringDefaultCriteria & Omit<import("./formats/string/types").StringSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/number/types").NumberSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/boolean/types").BooleanSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/symbol/types").SymbolSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & import("./formats/array/types").ArrayDefaultCriteria & Omit<import("./formats/array/types").ArraySetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "item"> & import("./formats/array/types").ArrayMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & import("./formats/record/types").RecordDefaultCriteria & Omit<import("./formats/record/types").RecordSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, keyof import("./formats/record/types").RecordMountedCriteria> & import("./formats/record/types").RecordMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, keyof import("./formats/struct/types").StructMountedCriteria<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>>> & import("./formats/struct/types").StructMountedCriteria<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/tuple/types").TupleSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "tuple"> & import("./formats/tuple/types").TupleMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/union/types").UnionSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "union"> & import("./formats/union/types").UnionMountedCriteria & import("./formats/types").StaticMountedCriteria), value: unknown): import("./services").Rejection["code"] | null;
            }>;
            set(formats: Record<string, import("./formats").FormatTemplate<SetableCriteria>>): void;
            get(type: string): {
                defaultCriteria: {} | import("./formats/array/types").ArrayDefaultCriteria | import("./formats/string/types").StringDefaultCriteria | import("./formats/record/types").RecordDefaultCriteria;
                mounting?(queue: import("./services").MountingTask[], path: import("./managers").RegistryValue["partPaths"], criteria: import("./formats/string/types").StringSetableCriteria | import("./formats/number/types").NumberSetableCriteria | import("./formats/boolean/types").BooleanSetableCriteria | import("./formats/symbol/types").SymbolSetableCriteria | import("./formats/array/types").ArraySetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/record/types").RecordSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/tuple/types").TupleSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>> | import("./formats/union/types").UnionSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>): void;
                checking(queue: import("./services").CheckingTask[], path: import("./managers").RegistryValue["partPaths"], criteria: (import("./formats/types").StaticDefaultCriteria & import("./formats/string/types").StringDefaultCriteria & Omit<import("./formats/string/types").StringSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/number/types").NumberSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/boolean/types").BooleanSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/symbol/types").SymbolSetableCriteria, never> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & import("./formats/array/types").ArrayDefaultCriteria & Omit<import("./formats/array/types").ArraySetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "item"> & import("./formats/array/types").ArrayMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & import("./formats/record/types").RecordDefaultCriteria & Omit<import("./formats/record/types").RecordSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, keyof import("./formats/record/types").RecordMountedCriteria> & import("./formats/record/types").RecordMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, keyof import("./formats/struct/types").StructMountedCriteria<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>>> & import("./formats/struct/types").StructMountedCriteria<import("./formats/struct/types").StructSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>> & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/tuple/types").TupleSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "tuple"> & import("./formats/tuple/types").TupleMountedCriteria & import("./formats/types").StaticMountedCriteria) | (import("./formats/types").StaticDefaultCriteria & Omit<import("./formats/union/types").UnionSetableCriteria<keyof import("./formats").FormatClassicTypes<keyof import("./formats").FormatClassicTypes<any>>>, "union"> & import("./formats/union/types").UnionMountedCriteria & import("./formats/types").StaticMountedCriteria), value: unknown): import("./services").Rejection["code"] | null;
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
        reject: import("./services").Rejection;
        value: null;
    };
}
