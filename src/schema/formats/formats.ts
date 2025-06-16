import { BooleanFormat } from "./boolean/format";
import { SymbolFormat } from "./symbol/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SimpleFormat } from "./simple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { UnionFormat } from "./union/format";

export const formatNatives = [
	BooleanFormat,
	SymbolFormat,
	NumberFormat,
	StringFormat,
	SimpleFormat,
	RecordFormat,
	StructFormat,
	ArrayFormat,
	TupleFormat,
	UnionFormat
];