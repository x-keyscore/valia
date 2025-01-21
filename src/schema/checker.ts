import type { SchemaCheckingTask, SchemaReject } from "./types";
import { VariantCriteria, MountedCriteria, formats} from "./formats";
import { RegistryInstance, registrySymbol } from './Registry'

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

function reject(
	registry: RegistryInstance,
	criteria: SchemaCheckingTask['criteria'],
	rejectState: string
): SchemaReject {
	return ({
		code: "REJECT_" + rejectState,
		path: registry.getPath(criteria, "."),
		type: criteria.type,
		label: criteria.label,
		message: criteria.message
	});
}

export function checker(
	criteria: MountedCriteria<VariantCriteria>,
	value: unknown
): SchemaReject | null {
	const registry = criteria[registrySymbol];
	let queue: SchemaCheckingTask[] = [{ criteria, value }];

	while (queue.length > 0) {
		const { criteria, value, link } = queue.pop()!;

		if (link?.finished) continue;

		if (value === null) {
			if (criteria.nullable) continue;
			reject(registry, criteria, "TYPE_NULL");
		}
		else if (value === undefined) {
			if (criteria.optional) continue;
			reject(registry, criteria, "TYPE_UNDEFINED");
		}

		const format = formats[criteria.type];
		const rejectState = format.checking(queue, criteria, value);
		const rejectBypass = manageTaskLink(link, !!rejectState);

		if (!rejectBypass && rejectState) {
			return (reject(registry, criteria, rejectState));
		}
	}

	return (null);
};