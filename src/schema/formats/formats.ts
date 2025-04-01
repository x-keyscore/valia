import type { Format, SetableCriteria, StaticDefaultCriteria } from "./types";
import { ArrayFormat } from "./array/format";
import { AtomicFormat } from "./atomic/format";
import { BooleanFormat } from "./boolean/format";
import { NumberFormat } from "./number/format";
import { RecordFormat } from "./record/format";
import { StringFormat } from "./string/format";
import { StructFormat } from "./struct/format";
import { SymbolFormat } from "./symbol/format";
import { TupleFormat } from "./tuple/format";
import { UnionFormat } from "./union/format";

export const staticDefaultCriteria: StaticDefaultCriteria = {
	nullable: false,
	undefinable: false
}

export const formatNatives = {
	array: ArrayFormat,
	atomic: AtomicFormat,
	boolean: BooleanFormat,
	number: NumberFormat,
	record: RecordFormat,
	string: StringFormat,
	struct: StructFormat,
	symbol: SymbolFormat,
	tuple: TupleFormat,
	union: UnionFormat
} satisfies Record<string, Format<SetableCriteria>>;