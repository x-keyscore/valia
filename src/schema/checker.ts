import { VariantCriteria, MountedCriteria, formats } from "../formats";
import { SchemaCheckingTask, SchemaCheckerReject } from "./types";

function manageTaskLink(
	link: SchemaCheckingTask['link'],
	isReject: boolean
) {
	if (link) {
		if (!isReject) {
			link.isClose = true;
		} else if (link.totalLinks !== link.totalRejected) {
			return (true);	
		}
	}

	return (false);
}

function basicCheckValue(task: SchemaCheckingTask): string | null {
	if (!task.criteria.nullable && task.value === null) {
		return ("TYPE_NULL");
	}
	else if (!task.criteria.optional && task.value === undefined) {
		return ("TYPE_UNDEFINED");
	}

	return (null);
}

function processTask(task: SchemaCheckingTask) {
	const { criteria, link } = task;
	const format = formats[criteria.type];

	if (link?.isClose) return ({
		skipTask: true
	});

	const rejectState = basicCheckValue(task) || format.checkValue(criteria, task.value);

	const rejectBypass = manageTaskLink(link, !!rejectState);

	if (rejectState) {
		return ({
			rejectBypass,
			rejectState
		});
	}

	const checkingTasks = format.getCheckingTasks?.(criteria, task.value);
	return ({
		rejectBypass: false,
		rejectState,
		checkingTasks
	});
}

export function checker(
	criteria: MountedCriteria<VariantCriteria>,
	value: unknown
): SchemaCheckerReject | null {
	let queue: SchemaCheckingTask[] = [{ criteria, value }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { rejectBypass, rejectState, checkingTasks } = processTask(currentTask);

		if (rejectBypass) {
			continue;
		} else if (rejectState) {
			const { criteria } = currentTask;

			return ({
				code: "REJECT_" + rejectState,
				type: criteria.type,
				label: criteria.label,
				message: criteria.message
			});
		}

		if (checkingTasks) Array.prototype.push.apply(queue, checkingTasks);
	}

	return (null);
};