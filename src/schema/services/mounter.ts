import type { SetableCriteria, MountedCriteria } from "../formats";
import type { PathSegments, MountingTask } from "./types";
import type { SchemaInstance } from "../types";
import { staticDefaultCriteria } from "../formats";

export const nodeSymbol = Symbol('internal');

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MountingChunk extends Array<MountingTask> {
	constructor(public paths: PathSegments) {
		super();
	}

	add(
		task: {
			node: SetableCriteria | MountedCriteria,
			partPaths: PathSegments
		}
	) {
		this.push({
			node: task.node,
			partPaths: task.partPaths,
			fullPaths: {
				explicit: this.paths.explicit.concat(task.partPaths.explicit),
				implicit: this.paths.implicit.concat(task.partPaths.implicit)
			}
		});
	}
}

export function mounter<T extends SetableCriteria>(
	managers: SchemaInstance['managers'],
	rootNode: SetableCriteria & T
): MountedCriteria<T> {
	const formats = managers.formats;
	const events = managers.events;
	const queue: MountingTask[] = [{
		node: rootNode,
		partPaths: { explicit: [], implicit: [] },
		fullPaths: { explicit: [], implicit: [] }
	}];

	while (queue.length) {
		const { node, partPaths, fullPaths } = queue.pop()!;

		if (hasNodeSymbol(node)) {
			node[nodeSymbol] = {
				partPaths,
				childNodes: node[nodeSymbol].childNodes,
			}
		} else {
			const format = formats.get(node.type);
			const chunk = new MountingChunk(fullPaths);

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

			if (chunk.length) queue.push(...chunk);

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