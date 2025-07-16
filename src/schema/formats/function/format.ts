import type { FunctionSetableCriteria, FunctionErrorCodes, FunctionRejectCodes, FunctionCustomMembers } from "./types";
import type { Format } from "../types";
import { getInternalTag } from "../../../helpers";
import { isArray } from "../../../testers";

export const FunctionFormat: Format<
	FunctionSetableCriteria,
	FunctionErrorCodes,
	FunctionRejectCodes,
	FunctionCustomMembers
> = {
	type: "function",
	errors: {
		VARIANT_PROPERTY_MALFORMED:
			"The 'variant' property must be of type String.",
		VARIANT_PROPERTY_STRING_MISCONFIGURED:
			"The 'variant' property must be a known string.",
		VARIANT_PROPERTY_ARRAY_LENGTH_MISCONFIGURED:
			"The array length of the 'variant' must be greater than 0.",
		VARIANT_PROPERTY_ARRAY_ITEM_MISCONFIGURED:
			"The array items of the 'variant' property must be a known string."
	},
	variantBitflags: {
		BASIC:				1 << 1,
		ASYNC:				1 << 2,
		BASIC_GENERATOR:	1 << 3,
		ASYNC_GENERATOR:	1 << 4
	},
	tagBitflags: {
		Function:				1 << 1,
		AsyncFunction:			1 << 2,
		GeneratorFunction:		1 << 3,
		AsyncGeneratorFunction:	1 << 4
	},
	mount(chunk, criteria) {
		const { variant } = criteria;

		if (variant !== undefined) {
			if (typeof variant == "string") {
				if (!(variant in this.variantBitflags)) {
					return ("VARIANT_PROPERTY_STRING_MISCONFIGURED");
				}
			} else if (isArray(variant)) {
				if (variant.length < 1) {
					return ("VARIANT_PROPERTY_ARRAY_LENGTH_MISCONFIGURED");
				}
				for (const item of variant) {
					if (!(item in this.variantBitflags)) {
						return ("VARIANT_PROPERTY_ARRAY_ITEM_MISCONFIGURED");
					}
				}
			} else {
				return ("VARIANT_PROPERTY_MALFORMED");
			}
		}

		if (isArray(variant)) {
			Object.assign(criteria, {
				bitcode: variant.reduce((code, key) => (
					code | this.variantBitflags[key]
				), 0)
			});
		} else {
			Object.assign(criteria, {
				bitcode: variant
					? this.variantBitflags[variant]
					: 0
			});
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "function") {
			return ("TYPE_FUNCTION_UNSATISFIED");
		}

		const { variantBitcode } = criteria;
		const { tagBitflags } = this;

		if (variantBitcode) {
			const tag = getInternalTag(value) as string;
			const tagBitflag = tagBitflags[tag];

			if (!tagBitflag || !(variantBitcode & tagBitflag)) {
				return ("VARIANT_UNSATISFIED");
			}
		}


		return (null);
	}
}
