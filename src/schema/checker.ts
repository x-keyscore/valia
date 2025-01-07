import { FormatsCriteria, MountedCriteria, formatsInstances } from "../formats";
import { SchemaCheckTask, SchemaCheckerResult } from "./types";

function processTask(task: SchemaCheckTask) {
	const format = formatsInstances[task.mountedCriteria.type];

	const checkResult = format.checkValue(task.mountedCriteria as any, task.value);
	const checkingTasks = format.getCheckingTasks(task.mountedCriteria as any, task.value);

	return ({ checkResult, checkingTasks });
}

export function schemaChecker(
	mountedCriteria: MountedCriteria<FormatsCriteria>,
	value: unknown
): SchemaCheckerResult {
	let queue: SchemaCheckTask[] = [{ mountedCriteria, value }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { checkResult, checkingTasks } = processTask(currentTask);

		if (checkResult.error) {
			return ({
				error: {
					code: checkResult.error.code,
					label: currentTask.mountedCriteria.label
				}
			});
		}

		queue.push(...checkingTasks);
	}
	return ({
		error: null
	});
};