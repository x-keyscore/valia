import { isArray, isPlainObject } from "../testers";
import { VariantCriteria } from "./formats";
import { isMountedCriteria } from "./mounter";

interface SchemaCloningTask {
	src: unknown;
	cpy: any;
}

function processTask(
	queue: SchemaCloningTask[],
	{ src, cpy }: SchemaCloningTask
) {
	if (isPlainObject(src)) {
		if (isMountedCriteria(src)) {
			cpy = src;
		}
		else {
			const keys = Reflect.ownKeys(src);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				
				if (isPlainObject(src[key])) {
					if (isMountedCriteria(src[key])) {
						cpy[key] = src[key];
					} else {
						cpy[key] = {};

						queue.push({
							src: src[key],
							cpy: cpy[key]
						});
					}
				} else if (isArray(src[key])) {
					cpy[key] = [];

					queue.push({
						src: src[key],
						cpy: cpy[key]
					});
				} else {
					cpy[key] = src[key];
				}
			}
		}
	}
	else if (isArray(src)) {
		for (let i = 0; i < src.length; i++) {
			
			if (isPlainObject(src[i])) {
				if (isMountedCriteria(src[i] as object)) {
					cpy[i] = src[i];
				} else {
					cpy[i] = {};

					queue.push({
						src: src[i],
						cpy: cpy[i]
					});
				}
			} else if (isArray(src[i])) {
				cpy[i] = [];

				queue.push({
					src: src[i],
					cpy: cpy[i]
				});
			} else {
				cpy[i] = src[i];
			}
		}
	}
	else {
		cpy = src;
	}
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

		processTask(queue, currentTask);
	}

	return (cpy as T);
};