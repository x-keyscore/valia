import type { FormatTemplate, VariantCriteria, DefaultVariantCriteria } from "./types";
import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SymbolFormat } from "./symbol/format";
import { BooleanFormat } from "./boolean/format";
import { UnionFormat } from "./union/format";

export const defaultVariantCriteria: DefaultVariantCriteria = {
	nullable: false,
	undefinable: false
}

export const formats: Record<string, FormatTemplate<VariantCriteria>> = {
	array: ArrayFormat,
	tuple: TupleFormat,
	record: RecordFormat,
	struct: StructFormat,
	number: NumberFormat,
	string: StringFormat,
	symbol: SymbolFormat,
	boolean: BooleanFormat,
	union: UnionFormat
};