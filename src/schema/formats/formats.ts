import { UndefinedFormat, UnknownFormat, NullFormat } from "./simple/format";
import { FunctionFormat } from "./function/format";
import { BooleanFormat } from "./boolean/format";
import { SymbolFormat } from "./symbol/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { ObjectFormat } from "./object/format";
import { ArrayFormat } from "./array/format";
import { UnionFormat } from "./union/format";

export const formatNatives = [
	FunctionFormat,
	BooleanFormat,
	SymbolFormat,
	NumberFormat,
	StringFormat,
	ObjectFormat,
	ArrayFormat,
	UnionFormat,
	UndefinedFormat,
	UnknownFormat,
	NullFormat,
];