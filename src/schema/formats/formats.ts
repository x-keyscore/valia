import type { Format, SetableCriteria, StaticDefaultCriteria } from "./types";
import { BooleanFormat } from "./boolean/format";
import { SymbolFormat } from "./symbol/format";
import { StringFormat } from "./string/format";
import { NumberFormat } from "./number/format";
import { StructFormat } from "./struct/format";
import { RecordFormat } from "./record/format";
import { TupleFormat } from "./tuple/format";
import { ArrayFormat } from "./array/format";
import { OmegaFormat } from "./omega/format";
import { UnionFormat } from "./union/format";

export const staticDefaultCriteria: StaticDefaultCriteria = {
	nullable: false,
	undefinable: false
}

export const formatNatives = {
	boolean: BooleanFormat,
	symbol: SymbolFormat,
	string: StringFormat,
	number: NumberFormat,
	struct: StructFormat,
	record: RecordFormat,
	tuple: TupleFormat,
	array: ArrayFormat,
	omega: OmegaFormat,
	union: UnionFormat
} satisfies Record<string, Format<SetableCriteria>>;