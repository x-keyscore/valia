import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SymbolFormat } from "./symbol/format";
import { BooleanFormat } from "./boolean/format";
import { constructs } from "../schema/utils";

export const formats = {
	array: ArrayFormat,
	tuple: TupleFormat,
	record: RecordFormat,
	struct: StructFormat,
	number: NumberFormat,
	string: StringFormat,
	symbol: SymbolFormat,
	boolean: BooleanFormat
}

export const formatsInstances = constructs(formats, []);