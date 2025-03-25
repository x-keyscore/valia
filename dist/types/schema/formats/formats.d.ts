import type { Format, StaticDefaultCriteria } from "./types";
export declare const staticDefaultCriteria: StaticDefaultCriteria;
export declare const formatNatives: {
    array: {
        defaultCriteria: import("./array/types").ArrayDefaultCriteria;
        mount?(chunk: import("../services").MountingChunk, criteria: import("./array/types").ArraySetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & import("./array/types").ArrayDefaultCriteria & Omit<import("./array/types").ArraySetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "item"> & import("./array/types").ArrayMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    boolean: {
        defaultCriteria: {};
        mount?(chunk: import("../services").MountingChunk, criteria: import("./boolean/types").BooleanSetableCriteria): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & Omit<import("./boolean/types").BooleanSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    number: {
        defaultCriteria: {};
        mount?(chunk: import("../services").MountingChunk, criteria: import("./number/types").NumberSetableCriteria): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & Omit<import("./number/types").NumberSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    record: {
        defaultCriteria: import("./record/types").RecordDefaultCriteria;
        mount?(chunk: import("../services").MountingChunk, criteria: import("./record/types").RecordSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & import("./record/types").RecordDefaultCriteria & Omit<import("./record/types").RecordSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, keyof import("./record/types").RecordMountedCriteria> & import("./record/types").RecordMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    string: {
        defaultCriteria: import("./string/types").StringDefaultCriteria;
        mount?(chunk: import("../services").MountingChunk, criteria: import("./string/types").StringSetableCriteria): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & import("./string/types").StringDefaultCriteria & Omit<import("./string/types").StringSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    struct: Format<import("./struct/types").StructSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, import("./struct/format").CustomProperties>;
    symbol: {
        defaultCriteria: {};
        mount?(chunk: import("../services").MountingChunk, criteria: import("./symbol/types").SymbolSetableCriteria): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & Omit<import("./symbol/types").SymbolSetableCriteria, never> & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    tuple: {
        defaultCriteria: {};
        mount?(chunk: import("../services").MountingChunk, criteria: import("./tuple/types").TupleSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & Omit<import("./tuple/types").TupleSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "tuple"> & import("./tuple/types").TupleMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
    union: {
        defaultCriteria: {};
        mount?(chunk: import("../services").MountingChunk, criteria: import("./union/types").UnionSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>): void;
        check(chunk: import("../services").CheckingChunk, criteria: StaticDefaultCriteria & Omit<import("./union/types").UnionSetableCriteria<keyof import("./types").FormatClassicTypes<keyof import("./types").FormatClassicTypes<any>>>, "union"> & import("./union/types").UnionMountedCriteria & import("./types").StaticMountedCriteria, value: unknown): import("../services").CheckerReject["code"] | null;
    };
};
