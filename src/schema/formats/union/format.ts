import type { CheckingTaskHooks } from "../../services/types";
import type { UnionSetableCriteria } from "./types";
import type { FormatTemplate } from "../types";

interface HooksCustomProperties {
	totalRejected: number;
	totalHooked: number;
	isFinished: boolean;
}

export const UnionFormat: FormatTemplate<UnionSetableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mounting(queue, path, criteria) {
		for (let i = 0; i < criteria.union.length; i++) {

			queue.push({
				prevCriteria: criteria,
				prevPath: path,
				criteria: criteria.union[i],
				pathSegments: {
					explicit: ["union", i],
					implicit: []
				}
			});
		}
	},
	checking(queue, path, criteria, value) {
		const unionLength = criteria.union.length;

		const hooks: CheckingTaskHooks<HooksCustomProperties> = {
			owner: { criteria, path },
			totalRejected: 0,
			totalHooked: unionLength,
			isFinished: false,
			beforeCheck(criteria) {
				if(this.isFinished) return (false);
				return (true);
			},
			afterCheck(criteria, reject) {
				if (reject) this.totalRejected++;

				if (this.totalRejected === this.totalHooked) {
					this.isFinished = true;
					return ("VALUE_UNSATISFIED_UNION");
				} else if (reject) {
					return (false);
				} else {
					return (true);
				}
			}
		};

		for (let i = 0; i < unionLength; i++) {
			queue.push({
				prevPath: path,
				criteria: criteria.union[i],
				value,
				hooks
			});
		}

		return (null);
	}
}


