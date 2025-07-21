import type { UnionSetableCriteria, UnionExceptionCodes, UnionRejectionCodes } from "./types";
import type { CheckerHooks } from "../../services";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const UnionFormat: Format<UnionSetableCriteria, UnionExceptionCodes> = {
	type: "union",
	exceptions: {
		UNION_PROPERTY_REQUIRED:
            "The 'union' property is required.",
       	UNION_PROPERTY_MALFORMED:
			"The 'union' property must be of type Array.",
		UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED:
			"The array length of the 'union' must be greater than 0.",
        UNION_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'union' property must be of type Plain Object.",
    },
	mount(chunk, criteria) {
		if (!("union" in criteria)) {
			return ("UNION_PROPERTY_REQUIRED");
		}

		const union = criteria.union;
		const unionLength = union.length;

		if (!isArray(union)) {
			return ("UNION_PROPERTY_MALFORMED");
		}
		if (unionLength < 1) {
			return ("UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED");
		}

		for (let i = 0; i < unionLength; i++) {
			const node = union[i];

			if (!isPlainObject(node) && !isArray(node)) {
				return ("UNION_PROPERTY_ARRAY_ITEM_MALFORMED");
			}

			chunk.push({
				node: node,
				partPath: {
					explicit: ["union", i]
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		const union = criteria.union;
		const unionLength = union.length;

		let rejectCount = 0;
		const hooks: CheckerHooks<UnionRejectionCodes> = {
			onAccept() {
				return ({
					action: "IGNORE",
					target: "CHUNK"
				});
			},
			onReject() {
				if (++rejectCount === unionLength) {
					return ({
						action: "REJECT",
						code: "UNION_UNSATISFIED"
					});
				}
				return ({
					action: "IGNORE",
					target: "BRANCH"
				});
			}
		};

		for (let i = 0; i < unionLength; i++) {
			chunk.push({
				hooks,
				data,
				node: union[i]
			});
		}

		return (null);
	}
}
