import type { UnionSetableCriteria } from "./types";
import type { Format } from "../types";

interface HooksCustomProperties {
	totalRejected: number;
	totalHooked: number;
	isFinished: boolean;
}

export const UnionFormat: Format<UnionSetableCriteria> = {
	defaultCriteria: {
		empty: false
	},
	mount(chunk, criteria) {
		for (let i = 0; i < criteria.union.length; i++) {
			chunk.add({
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

		for (let i = 0; i < unionLength; i++) {
			chunk.addTask({
				data,
				node: criteria.union[i],
				hooks: {
					onAccept() {
						return true
					},
					onReject() {
						return true
					}
				}
			});
		}

		return (null);
	}
}

/*
const hooks: CheckingTaskHooks<HooksCustomProperties> = {
	owner: { node: criteria, path },
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
};*/


