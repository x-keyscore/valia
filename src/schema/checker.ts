import type { SchemaCheckingTask, SchemaCheckerReject } from "./types";
import { VariantCriteria, MountedCriteria, formats} from "./formats";
import { metadataSymbol } from './mounter'

function manageTaskLink(
	link: SchemaCheckingTask['link'],
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

function basicChecking(
	criteria: SchemaCheckingTask['criteria'],
	value: unknown
): string | null {
	if (!criteria.nullable && value === null) {
		return ("TYPE_NULL");
	}
	else if (!criteria.optional && value === undefined) {
		return ("TYPE_UNDEFINED");
	}

	return (null);
}

export function checker(
	criteria: MountedCriteria<VariantCriteria>,
	value: unknown
): SchemaCheckerReject | null {
	const register = criteria[metadataSymbol].register;
	let queue: SchemaCheckingTask[] = [{ criteria, value }];

	while (queue.length > 0) {
		const { criteria, value, link } = queue.pop()!;

		if (link?.finished) continue;

		const format = formats[criteria.type];
		const rejectState = basicChecking(criteria, value) || format.checking(queue, criteria, value);
		const rejectBypass = manageTaskLink(link, !!rejectState);

		if (!rejectBypass && rejectState) {
			return ({
				code: "REJECT_" + rejectState,
				path: register.getPath(criteria, "."),
				type: criteria.type,
				label: criteria.label,
				message: criteria.message
			});
		}
	}

	return (null);
};