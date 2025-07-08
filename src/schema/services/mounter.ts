import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MounterTask, MounterChunk } from "./types";
import type { SchemaInstance } from "../types";
import { SchemaNodeError } from "../utils";

export const nodeSymbol = Symbol("node");

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MounterStack {
	tasks: MounterTask[] = [];

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
		sourceTask: MounterTask,
		chunk: MounterChunk
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
	const stack = new MounterStack(rootNode);

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
			const chunk: MounterChunk = [];

			const error = format.mount?.(chunk, node);

			if (error) {
				throw new SchemaNodeError({
					node: node,
					path: fullPaths,
					type: format.type,
					code: error,
					message: format.errors[error]
				});
			}

			Object.assign(node, {
				[nodeSymbol]: {
					partPaths,
					childNodes: chunk.map((task) => task.node)
				}
			});
			Object.freeze(node);

			if (chunk.length) {
				stack.pushChunk(currentTask, chunk);
			}

			events.emit(
				"NODE_MOUNTED",
				node as MountedCriteria,
				fullPaths
			);
		}
	}

	events.emit("TREE_MOUNTED", rootNode as MountedCriteria<T>);

	return (rootNode as MountedCriteria<T>);
};