import { FunctionFormat } from "./function/format";
import { BooleanFormat } from "./boolean/format";
import { UnknownFormat } from "./unknown/format";
import { SymbolFormat } from "./symbol/format";
import { NumberFormat } from "./number/format";
import { StringFormat } from "./string/format";
import { SimpleFormat } from "./simple/format";
import { ObjectFormat } from "./object/format";
import { ArrayFormat } from "./array/format";
import { UnionFormat } from "./union/format";

export const formatNatives = [
	FunctionFormat,
	BooleanFormat,
	UnknownFormat,
	SymbolFormat,
	NumberFormat,
	StringFormat,
	SimpleFormat,
	ObjectFormat,
	ArrayFormat,
	UnionFormat
];