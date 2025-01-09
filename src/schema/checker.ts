import { FormatsCriteria, MountedCriteria, formatsInstances } from "../formats";
import { SchemaCheckTask, SchemaCheckReject } from "./types";

function processTask(task: SchemaCheckTask) {
	const format = formatsInstances[task.criteria.type];

	const rejectCode = format.checkEntry(task.criteria as any, task.entry);
	const checkingTasks = format.getCheckingTasks(task.criteria as any, task.entry);

	return ({
		rejectCode,
		checkingTasks
	});
}

export function schemaChecker(
	criteria: MountedCriteria<FormatsCriteria>,
	entry: unknown
): SchemaCheckReject | null {
	let queue: SchemaCheckTask[] = [{ criteria, entry }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { rejectCode, checkingTasks } = processTask(currentTask);

		if (rejectCode) {
			return ({
				code: rejectCode,
				type: currentTask.criteria.type,
				label: currentTask.criteria.label,
				message: currentTask.criteria.message
			});
		}

		queue.push(...checkingTasks);
	}

	return (null);
};