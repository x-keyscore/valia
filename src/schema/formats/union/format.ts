import type { UnionSetableCriteria, UnionErrors, UnionRejects } from "./types";
import type { CheckerHooks } from "../../services";
import type { Format } from "../types";
import { isPlainObject, isArray } from "../../../testers";

export const UnionFormat: Format<UnionSetableCriteria, UnionErrors> = {
	type: "union",
	errors: {
		UNION_PROPERTY_REQUIRED:
            "The 'union' property is required.",
       	UNION_PROPERTY_MALFORMED:
			"The 'union' property must be of type Array.",
        UNION_PROPERTY_ARRAY_ITEM_MALFORMED:
            "The array items of the 'tuple' property must be of type Plain Object.",
    },
	mount(chunk, criteria) {
		if (!("union" in criteria)) {
			return ("UNION_PROPERTY_REQUIRED");
		}
		if (!isArray(criteria.union)) {
			return ("UNION_PROPERTY_MALFORMED");
		}
		for (const item of criteria.union) {
			if (!isPlainObject(item) && !isArray(item)) {
				return ("UNION_PROPERTY_ARRAY_ITEM_MALFORMED");
			}
		}

		const unionLength = criteria.union.length;

		for (let i = 0; i < unionLength; i++) {
			chunk.push({
				node: criteria.union[i],
				partPaths: {
					explicit: ["union", i],
					implicit: []
				}
			});
		}

		return (null);
	},
	check(chunk, criteria, data) {
		const unionLength = criteria.union.length;
		let rejectCount = 0;

		const hooks: CheckerHooks<UnionRejects> = {
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
				node: criteria.union[i]
			});
		}

		return (null);
	}
}
