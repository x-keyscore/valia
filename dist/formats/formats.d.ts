import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SymbolFormat } from "./symbol/format";
import { BooleanFormat } from "./boolean/format";
export declare const formats: {
    array: typeof ArrayFormat;
    tuple: typeof TupleFormat;
    record: typeof RecordFormat;
    struct: typeof StructFormat;
    number: typeof NumberFormat;
    string: typeof StringFormat;
    symbol: typeof SymbolFormat;
    boolean: typeof BooleanFormat;
};
export declare const formatsInstances: {
    array: ArrayFormat<import("./array/types").ArrayCriteria>;
    tuple: TupleFormat<import("./tuple/types").TupleCriteria>;
    record: RecordFormat<import("./record/types").RecordCriteria>;
    struct: StructFormat<import("./struct/types").StructCriteria>;
    number: NumberFormat<import("./number/types").NumberCriteria>;
    string: StringFormat<import("./string/types").StringCriteria>;
    symbol: SymbolFormat<import("./symbol/types").SymbolCriteria>;
    boolean: BooleanFormat<import("./boolean/types").BooleanCriteria>;
};
