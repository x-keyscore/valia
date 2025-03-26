import type { SetableCriteria, MountedCriteria } from "../formats";
import type { PathSegments, MountingTask, MountingChunk } from "./types";
import type { SchemaInstance } from "../types";
import { staticDefaultCriteria } from "../formats";

export const nodeSymbol = Symbol('internal');

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MountingQueue extends Array<MountingTask> {
	constructor(rootNode: SetableCriteria | MountedCriteria) { 
		super();

		this.push({
			node: rootNode,
			partPaths: { explicit: [], implicit: [] },
			fullPaths: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		owner: MountingTask,
		chunk: MountingChunk
	) {
		for (let i = 0; i < chunk.length; i++) {
			const task = chunk[i];

			this.push({
				node: task.node,
				partPaths: task.partPaths,
				fullPaths: {
					explicit: owner.fullPaths.explicit.concat(task.partPaths.explicit),
					implicit: owner.fullPaths.implicit.concat(task.partPaths.implicit)
				}
			});
		}
		
	}
}

export function mounter<T extends SetableCriteria>(
	managers: SchemaInstance['managers'],
	rootNode: SetableCriteria & T
): MountedCriteria<T> {
	const formats = managers.formats;
	const events = managers.events;
	const queue = new MountingQueue(rootNode);

	while (queue.length) {
		const task = queue.pop()!;
		const { node, partPaths, fullPaths } = task;

		if (hasNodeSymbol(node)) {
			node[nodeSymbol] = {
				...node[nodeSymbol],
				partPaths
			}
		} else {
			const format = formats.get(node.type);
			const chunk: MountingChunk = [];

			format.mount?.(chunk, node);

			Object.assign(node, {
				...staticDefaultCriteria,
				...format.defaultCriteria,
				...node,
				[nodeSymbol]: {
					partPaths,
					childNodes: new Set(chunk.map((task) => task.node)),
				}
			});

			Object.freeze(node);

			if (chunk.length) queue.pushChunk(task, chunk);

			events.emit(
				"NODE_MOUNTED",
				node as MountedCriteria,
				fullPaths
			);
		}
	}

	events.emit(
		"TREE_MOUNTED",
		rootNode as MountedCriteria<T>
	);

	return (rootNode as MountedCriteria<T>);
};