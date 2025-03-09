import type { FormatTemplate, StaticDefaultCriteria } from "./types";
export declare const staticDefaultCriteria: StaticDefaultCriteria;
export declare const nativeFormats: {
    array: {
        defaultCriteria: import("./array/types").ArrayDefaultCriteria;
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./array/types").ArraySetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & import("./array/types").ArrayDefaultCriteria & Omit<import("./array/types").ArraySetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "item"> & import("./array/types").ArrayMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    boolean: {
        defaultCriteria: {};
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./boolean/types").BooleanSetableCriteria): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & Omit<import("./boolean/types").BooleanSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    number: {
        defaultCriteria: {};
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./number/types").NumberSetableCriteria): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & Omit<import("./number/types").NumberSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    record: {
        defaultCriteria: import("./record/types").RecordDefaultCriteria;
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./record/types").RecordSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & import("./record/types").RecordDefaultCriteria & Omit<import("./record/types").RecordSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, keyof import("./record/types").RecordMountedCriteria> & import("./record/types").RecordMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    string: {
        defaultCriteria: import("./string/types").StringDefaultCriteria;
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./string/types").StringSetableCriteria): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & import("./string/types").StringDefaultCriteria & Omit<import("./string/types").StringSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    struct: FormatTemplate<import("./struct/types").StructSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, import("./struct/format").CustomProperties>;
    symbol: {
        defaultCriteria: {};
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./symbol/types").SymbolSetableCriteria): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & Omit<import("./symbol/types").SymbolSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    tuple: {
        defaultCriteria: {};
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./tuple/types").TupleSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & Omit<import("./tuple/types").TupleSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "tuple"> & import("./tuple/types").TupleMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
    union: {
        defaultCriteria: {};
        mounting?(queue: import("../services").MountingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: import("./union/types").UnionSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        checking(queue: import("../services").CheckingTask[], path: import("../managers").RegistryValue["partPaths"], criteria: StaticDefaultCriteria & Omit<import("./union/types").UnionSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "union"> & import("./union/types").UnionMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").Rejection["code"] | null;
    };
};
