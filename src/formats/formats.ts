import { ArrayFormat } from "./array/array";
import { NumberFormat } from "./number/number";
import { RecordFormat } from "./record/record";
import { StringFormat } from "./string/string";

export const formats = {
	record: RecordFormat,
	array: ArrayFormat,
	string: StringFormat,
	number: NumberFormat
}