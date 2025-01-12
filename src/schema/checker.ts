import { FormatsCriteria, MountedCriteria, formatsInstances } from "../formats";
import { SchemaCheckingTask, SchemaCheckerReject } from "./types";

function processTask(task: SchemaCheckingTask) {
	const format = formatsInstances[task.criteria.type];

	const rejectState = format.checkValue(task.criteria as any, task.value);
	const checkingTasks = format.getCheckingTasks(task.criteria as any, task.value);

	return ({
		rejectState,
		checkingTasks
	});
}

export function schemaChecker(
	criteria: MountedCriteria<FormatsCriteria>,
	value: unknown
): SchemaCheckerReject | null {
	let queue: SchemaCheckingTask[] = [{ criteria, value }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { rejectState, checkingTasks } = processTask(currentTask);

		if (rejectState) {
			return ({
				code: "REJECT_" + rejectState,
				type: currentTask.criteria.type,
				label: currentTask.criteria.label,
				message: currentTask.criteria.message
			});
		}

		queue.push(...checkingTasks);
	}

	return (null);
};