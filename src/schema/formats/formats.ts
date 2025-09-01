import { UndefinedFormat } from "./undefined/format";
import { FunctionFormat } from "./function/format";
import { BooleanFormat } from "./boolean/format";
import { UnknownFormat } from "./unknown/format";
import { SymbolFormat } from "./symbol/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { ObjectFormat } from "./object/format";
import { ArrayFormat } from "./array/format";
import { UnionFormat } from "./union/format";
import { NullFormat } from "./null/format";

export const formatNatives = [
	UndefinedFormat,
	FunctionFormat,
	BooleanFormat,
	UnknownFormat,
	SymbolFormat,
	NumberFormat,
	StringFormat,
	ObjectFormat,
	ArrayFormat,
	UnionFormat,
	NullFormat
];