import type { CheckingChunkTask } from "../../services";
import type { UnionSetableCriteria } from "./types";
import type { Format } from "../types";
import { Issue } from "../../../utils";

export const UnionFormat: Format<UnionSetableCriteria> = {
	defaultCriteria: {},
	mount(chunk, criteria) {
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
	},
	check(chunk, criteria, data) {
		const unionLength = criteria.union.length;

		const total = {
			hooked: unionLength,
			rejected: 0
		};

		const hooks: CheckingChunkTask['hooks'] = {
			onAccept() {
				return ({
					action: "IGNORE",
					target: "CHUNK"
				});
			},
			onReject() {
				total.rejected++;
				if (total.rejected === total.hooked) {
					return ({
						action: "REJECT",
						code: "DATA_UNION_MISMATCH"
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
