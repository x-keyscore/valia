import type { CheckingTask, CheckerReject } from "./types";
import type { TunableCriteria, MountedCriteria } from "../formats";
import { MapperInstance, mapperSymbol } from '../handlers'
import { formats } from "../formats";

function manageTaskLink(
	link: CheckingTask['link'],
	isReject: boolean
) {
	if (link) {
		if (!isReject) {
			link.finished = true;
		} else {
			link.totalRejected++;
			if (link.totalLinks !== link.totalRejected) return (true);
		}
	}

	return (false);
}

function reject(
	mapper: MapperInstance,
	criteria: CheckingTask['criteria'],
	rejectCode: string
): CheckerReject {
	return ({
		code: rejectCode,
		path: mapper.getPath(criteria, "."),
		type: criteria.type,
		label: criteria.label,
		message: criteria.message
	});
}

export function checker(
	criteria: MountedCriteria<TunableCriteria>,
	value: unknown
): CheckerReject | null {
	const mapper = criteria[mapperSymbol];
	let queue: CheckingTask[] = [{ criteria, value }];

	while (queue.length > 0) {
		const { criteria, value, link } = queue.pop()!;

		if (link?.finished) continue;

		if (value === null) {
			if (criteria.nullable) continue;
			return (reject(mapper, criteria, "TYPE_NULL"));
		}
		else if (value === undefined) {
			if (criteria.undefinable) continue;
			return (reject(mapper, criteria, "TYPE_UNDEFINED"));
		}

		const format = formats[criteria.type];
		const rejectCode = format.checking(queue, criteria, value);
		const rejectBypass = manageTaskLink(link, !!rejectCode);

		if (!rejectBypass && rejectCode) {
			return (reject(mapper, criteria, rejectCode));
		}
	}

	return (null);
};