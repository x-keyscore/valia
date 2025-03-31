import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MountingTask, MountingChunk } from "./types";
import type { SchemaInstance } from "../types";
import { staticDefaultCriteria } from "../formats";

export const nodeSymbol = Symbol('internal');

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MountingStack extends Array<MountingTask> {
	constructor(rootNode: SetableCriteria | MountedCriteria) { 
		super();

		this.push({
			node: rootNode,
			partPaths: { explicit: [], implicit: [] },
			fullPaths: { explicit: [], implicit: [] }
		})
	}

	addChunk(
		owner: MountingTask,
		chunk: MountingChunk
	) {
		const { fullPaths } = owner;

		for (let i = 0; i < chunk.length; i++) {
			const { node, partPaths } = chunk[i];

			this.push({
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

	while (stack.length) {
		const currentTask = stack.pop()!;
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
				...staticDefaultCriteria,
				...format.defaultCriteria,
				...node,
				[nodeSymbol]: {
					childNodes: chunk.map((task) => task.node),
					partPaths
				}
			});
			Object.freeze(node);

			if (chunk.length) {
				stack.addChunk(currentTask, chunk);
			}

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