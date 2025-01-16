import type { FormatTemplate, VariantCriteria, MountedCriteria } from "./types";
import { ArrayFormat } from "./array/format";
import { TupleFormat } from "./tuple/format";
import { RecordFormat } from "./record/format";
import { StructFormat } from "./struct/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SymbolFormat } from "./symbol/format";
import { BooleanFormat } from "./boolean/format";
import { UnionFormat } from "./union/format";

export const mountedMarkerSymbol = Symbol('mountedMarker');

export function isMountedCriteria(
	criteria: object
): criteria is MountedCriteria<VariantCriteria> {
	return (Reflect.has(criteria, mountedMarkerSymbol));
}

export const formatDefaultCriteria = {
	optional: false,
	nullable: false
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