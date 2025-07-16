import type { SimpleSetableCriteria, SimpleErrorCodes, SimpleRejectCodes, SimpleCustomMembers } from "./types";
import type { Format } from "../types";

export const SimpleFormat: Format<
	SimpleSetableCriteria,
	SimpleErrorCodes,
	SimpleRejectCodes,
	SimpleCustomMembers
> = {
	type: "simple",
	errors: {
		VARIANT_PROPERTY_REQUIRED:
            "The 'variant' property must be defined.",
        VARIANT_PROPERTY_MALFORMED:
            "The 'variant' property must be of type String.",
		VARIANT_PROPERTY_STRING_MISCONFIGURED:
            "The 'variant' property must be a known string."
	},
	variantBitflags: {
		UNKNOWN:	1 << 0,
		NULLISH:	1 << 1,
		NULL:		1 << 2,
		UNDEFINED:	1 << 3
	},
	mount(chunk, criteria) {
		const { variant } = criteria;

		if (!("variant" in criteria)) {
			return ("VARIANT_PROPERTY_REQUIRED");
		}
		if (typeof variant !== "string") {
			return ("VARIANT_PROPERTY_MALFORMED");
		}
		if (!(variant in this.variantBitflags)) {
			return ("VARIANT_PROPERTY_STRING_MISCONFIGURED");
		}

		Object.assign(criteria, {
			variantBitcode: this.variantBitflags[variant]
		});

		return (null);
	},
	check(chunk, criteria, value) {
		const { variantBitcode } = criteria;
		const { variantBitflags } = this
	
		if (variantBitcode & variantBitflags.UNKNOWN) {
			return (null);
		}
		if (variantBitcode & variantBitflags.NULLISH && value != null) {
			return ("VARIANT_NULLISH_UNSATISFIED");
		}
		if (variantBitcode & variantBitflags.NULL && value !== null) {
			return ("VARIANT_NULL_UNSATISFIED");
		}
		if ((variantBitcode & variantBitflags.UNDEFINED) && value !== undefined) {
			return ("VARIANT_UNDEFINED_UNSATISFIED");
		}

		return (null);
	}
}