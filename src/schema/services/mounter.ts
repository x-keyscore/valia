import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MountingTask, MountingChunk } from "./types";
import type { SchemaInstance } from "../types";

export const nodeSymbol = Symbol("node");

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MountingStack {
	tasks: MountingTask[] = [];

	constructor(
		rootNode: SetableCriteria | MountedCriteria
	) {
		this.tasks.push({
			node: rootNode,
			partPaths: { explicit: [], implicit: [] },
			fullPaths: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		sourceTask: MountingTask,
		chunk: MountingChunk
	) {
		const { fullPaths } = sourceTask;

		for (let i = 0; i < chunk.length; i++) {
			const { node, partPaths } = chunk[i];

			this.tasks.push({
				node,
				partPaths,
				fullPaths: {
					explicit: fullPaths.explicit.concat(partPaths.explicit),
					implicit: fullPaths.implicit.concat(partPaths.implicit)
				}
			});
		}
	}
}

export function mounter<T extends SetableCriteria>(
	managers: SchemaInstance['managers'],
	rootNode: SetableCriteria & T
): MountedCriteria<T> {
	const { formats, events } = managers;
	const stack = new MountingStack(rootNode);

	while (stack.tasks.length) {
		const currentTask = stack.tasks.pop()!;
		const { node, partPaths, fullPaths } = currentTask;

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
				...format.defaultCriteria,
				...node,
				[nodeSymbol]: {
					childNodes: chunk.map((task) => task.node),
					partPaths
				}
			});
			Object.freeze(node);

			if (chunk.length) stack.pushChunk(currentTask, chunk);

			events.emit("NODE_MOUNTED", node as MountedCriteria, fullPaths);
		}
	}

	events.emit("TREE_MOUNTED", rootNode as MountedCriteria<T>);

	return (rootNode as MountedCriteria<T>);
};