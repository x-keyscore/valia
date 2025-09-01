import type { UnionSetableCriteria, UnionExceptionCodes, UnionRejectionCodes } from "./types";
import type { CheckerChunkTaskHook } from "../../services";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const UnionFormat: Format<UnionSetableCriteria, UnionExceptionCodes> = {
	type: "union",
	exceptions: {
		UNION_PROPERTY_UNDEFINED:
            "The 'union' property must be defined.",
       	UNION_PROPERTY_MISDECLARED:
			"The 'union' property must be of type array.",
		UNION_PROPERTY_ARRAY_MISCONFIGURED:
			"The array of the 'union' property must have a number of items greater than 0.",
        UNION_PROPERTY_ARRAY_ITEM_MISDECLARED:
            "The array items of the 'union' property must be of type plain object.",
    },
	mount(chunk, criteria) {
		if (!("union" in criteria)) {
			return ("UNION_PROPERTY_UNDEFINED");
		}

		const union = criteria.union;
		const unionLength = union.length;

		if (!isArray(union)) {
			return ("UNION_PROPERTY_MISDECLARED");
		}
		if (unionLength < 1) {
			return ("UNION_PROPERTY_ARRAY_MISCONFIGURED");
		}

		for (let i = 0; i < unionLength; i++) {
			const node = union[i];

			if (!isPlainObject(node) && !isArray(node)) {
				return ("UNION_PROPERTY_ARRAY_ITEM_MISDECLARED");
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

		let rejectionCount = 0;
		const hook: CheckerChunkTaskHook<UnionRejectionCodes> = {
			onAccept() {
				return ({
					action: "CANCEL",
					target: "CHUNK"
				});
			},
			onReject() {
				if (++rejectionCount === unionLength) {
					return ({
						action: "REJECT",
						code: "UNION_UNSATISFIED"
					});
				}

				return ({
					action: "CANCEL",
					target: "BRANCH"
				});
			}
		};

		for (let i = 0; i < unionLength; i++) {
			chunk.push({
				hook,
				data,
				node: union[i],
			});
		}

		return (null);
	}
}
