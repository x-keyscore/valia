import { isArray, isPlainObject } from "../testers";
import { VariantCriteria } from "../formats";
import { isMountedCriteria } from "./mounter";

interface SchemaCloningTask {
	src: unknown;
	cpy: any;
}

function processTask(task: SchemaCloningTask) {
	let cloningTasks: SchemaCloningTask[] = [];

	if (isPlainObject(task.src)) {
		if (isMountedCriteria(task.src)) {
			task.cpy = task.src;
		}
		else {
			Object.assign(task.cpy, task.src);

			const keys = Object.keys(task.src);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (isPlainObject(task.src[key]) && isMountedCriteria(task.src)) {
					task.cpy[key] = {};
				}

				cloningTasks.push({
					src: task.src[key],
					cpy: task.cpy[key]
				});
			}
		}
	}
	else if (isArray(task.src)) {
		task.cpy = Object.assign([], task.src);

		for (let i = 0; i < task.src.length; i++) {
			if (isPlainObject(task.src[i]) && isMountedCriteria(task.src)) {
				task.cpy[i] = {};
			}

			cloningTasks.push({
				src: task.src[i],
				cpy: task.cpy[i]
			})
			
		}
	}
	else {
		task.cpy = task.src;
	}

	return ({
		cloningTasks
	});
}

/**
 * Clones the object starting from the root and stops traversing a branch
 * when the `mountedMarker` symbol is encountered. In such cases, the object
 * containing the symbol is directly assigned to the corresponding node.
 * 
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
export function cloner<T extends VariantCriteria>(
	src: T
): T {
	let cpy = {};
	let queue: SchemaCloningTask[] = [{ src, cpy }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { cloningTasks } = processTask(currentTask);

		if (cloningTasks) Array.prototype.push.apply(queue, cloningTasks);
	}

	return (cpy as T);
};