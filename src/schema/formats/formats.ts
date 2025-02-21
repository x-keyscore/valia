import type { FormatTemplate, StaticDefaultCriteria, SetableCriteria } from "./types";
import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SymbolFormat } from "./symbol/format";
import { BooleanFormat } from "./boolean/format";
import { UnionFormat } from "./union/format";

export const staticDefaultCriteria: StaticDefaultCriteria = {
	nullable: false,
	undefinable: false
}

export const formats: Record<string, FormatTemplate<SetableCriteria>> = {
	array: ArrayFormat,
	boolean: BooleanFormat,
	number: NumberFormat,
	record: RecordFormat,
	string: StringFormat,
	struct: StructFormat,
	symbol: SymbolFormat,
	tuple: TupleFormat,
	union: UnionFormat
};