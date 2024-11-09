import { ArrayFormat } from "./array/array";
import { NumberFormat } from "./number/number";
import { RecordFormat } from "./record/record";
import { StringFormat } from "./string/string";
export declare const formats: {
    record: typeof RecordFormat;
    array: typeof ArrayFormat;
    string: typeof StringFormat;
    number: typeof NumberFormat;
};
