import type { FunctionSetableCriteria, FunctionExceptionCodes, FunctionRejectionCodes, FunctionCustomMembers } from "./types";
import type { Format } from "../types";
import { getInternalTag } from "../../../helpers";
import { isArray } from "../../../testers";

export const FunctionFormat: Format<
	FunctionSetableCriteria,
	FunctionExceptionCodes,
	FunctionRejectionCodes,
	FunctionCustomMembers
> = {
	type: "function",
	exceptions: {
		NATURE_PROPERTY_MALFORMED:
			"The 'nature' property must be of type String.",
		NATURE_PROPERTY_STRING_MISCONFIGURED:
			"The 'nature' property must be a known string.",
		NATURE_PROPERTY_ARRAY_LENGTH_MISCONFIGURED:
			"The array length of the 'nature' must be greater than 0.",
		NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED:
			"The array items of the 'nature' property must be a known string."
	},
	natureBitflags: {
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
		const { nature } = criteria;

		if (nature !== undefined) {
			if (typeof nature == "string") {
				if (!(nature in this.natureBitflags)) {
					return ("NATURE_PROPERTY_STRING_MISCONFIGURED");
				}
			} else if (isArray(nature)) {
				if (nature.length < 1) {
					return ("NATURE_PROPERTY_ARRAY_LENGTH_MISCONFIGURED");
				}
				for (const item of nature) {
					if (!(item in this.natureBitflags)) {
						return ("NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED");
					}
				}
			} else {
				return ("NATURE_PROPERTY_MALFORMED");
			}
		}

		if (isArray(nature)) {
			Object.assign(criteria, {
				natureBitcode: nature.reduce((code, key) => (
					code | this.natureBitflags[key]
				), 0)
			});
		} else {
			Object.assign(criteria, {
				natureBitcode: nature
					? this.natureBitflags[nature]
					: 0
			});
		}

		return (null);
	},
	check(chunk, criteria, value) {
		if (typeof value !== "function") {
			return ("TYPE_FUNCTION_UNSATISFIED");
		}

		const { natureBitcode } = criteria;
		const { tagBitflags } = this;

		if (natureBitcode) {
			const tag = getInternalTag(value) as string;
			const tagBitflag = tagBitflags[tag];

			if (!tagBitflag || !(natureBitcode & tagBitflag)) {
				return ("NATURE_UNSATISFIED");
			}
		}


		return (null);
	}
}
