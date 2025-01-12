import { FormatsCriteria, MountedCriteria, formatsInstances } from "../formats";
import { SchemaMountingTask } from "./types";

function processTask(task: SchemaMountingTask): SchemaMountingTask[] {
	const format = formatsInstances[task.definedCriteria.type];
	if (!format) throw new Error("Unknown format type");
	
	format.mountCriteria(task.definedCriteria as any, task.mountedCriteria as any);
	const mountingTasks = format.getMountingTasks(task.definedCriteria as any, task.mountedCriteria as any)

	return (mountingTasks);
}

export function schemaMounter<T extends FormatsCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const mountingTasks = processTask(currentTask);

		queue.push(...mountingTasks);
	}

	return (mountedCriteria);
};