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

export const isMountedSymbol = Symbol('isMounted');

export function isAlreadyMounted(
	criteria: VariantCriteria | MountedCriteria<VariantCriteria>
): criteria is MountedCriteria<VariantCriteria> {
	return (Object.prototype.hasOwnProperty(isMountedSymbol));
}

export const formatDefaultCriteria = {
	[isMountedSymbol]: true,
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

//export const formatsInstances = constructs(formats, []);