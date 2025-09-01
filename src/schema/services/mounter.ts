import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MounterTask, CommonExceptionCodes, MounterChunkTask } from "./types";
import type { SchemaInstance } from "../types";
import { SchemaNodeException } from "../utils";
import { isPlainObject } from "../../testers";

export const nodeSymbol = Symbol("node");

const commonExceptions: Record<string, string> = {
	TYPE_PROPERTY_UNDEFINED:
		"",
	TYPE_PROPERTY_MISDECLARED:
		"",
	TYPE_PROPERTY_MISCONFIGURED:
		"",
	LABEL_PROPERTY_MISDECLARED:
		"",
	MESSAGE_PROPERTY_MISDECLARED:
		""
} satisfies Record<CommonExceptionCodes, string>;

function commonMount(
	managers: SchemaInstance['managers'],
	node: SetableCriteria
): CommonExceptionCodes | null {
	const { type, label, message } = node;

	if (!("type" in node)) {
		return ("TYPE_PROPERTY_UNDEFINED");
	}
	if (typeof type !== "string") {
		return ("TYPE_PROPERTY_MISDECLARED");
	}
	if (!managers.formats.has(type)) {
		return ("TYPE_PROPERTY_MISCONFIGURED");
	}
	if (label !== undefined && typeof label !== "string") {
		return ("LABEL_PROPERTY_MISDECLARED");
	}
	if (
		message !== undefined
		&& typeof message !== "string"
		&& typeof message !== "function"
	) {
		return ("MESSAGE_PROPERTY_MISDECLARED");
	}

	return (null);
}

export function hasNodeSymbol(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, nodeSymbol));
}

export class MounterStack {
	tasks: MounterTask[] = [];

	constructor(rootNode: SetableCriteria | MountedCriteria) {
		this.tasks.push({
			node: rootNode,
			partPath: { explicit: [], implicit: [] },
			nodePath: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		sourceTask: MounterTask,
		chunk: MounterChunkTask[]
	) {
		const prevNodePath = sourceTask.nodePath;

		for (let i = 0; i < chunk.length; i++) {
			const { node, partPath } = chunk[i];

			this.tasks.push({
				node,
				partPath,
				nodePath: {
					explicit: partPath.explicit
						? prevNodePath.explicit.concat(partPath.explicit)
						: prevNodePath.explicit,
					implicit: partPath.implicit
						? prevNodePath.implicit.concat(partPath.implicit)
						: prevNodePath.implicit
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
		const { node, nodePath, partPath } = currentTask;

		if (hasNodeSymbol(node)) {
			node[nodeSymbol] = {
				...node[nodeSymbol],
				partPath
			}
		} else {
			let code: string | null = null;

			code = commonMount(managers, node);
			if (code) {
				const message = commonExceptions[code];

				throw new SchemaNodeException(
					code, message, node, nodePath
				);
			}

			const format = formats.get(node.type);
			const chunkTasks: MounterChunkTask[] = [];

			code = format.mount(chunkTasks, node);
			if (code) {
				const message = format.exceptions[code];

				throw new SchemaNodeException(
					code, message, node, nodePath
				);
			}

			Object.assign(node, {
				[nodeSymbol]: {
					partPath,
					childNodes: chunkTasks.map((task) => task.node)
				}
			});
			Object.freeze(node);

			if (chunkTasks.length) {
				stack.pushChunk(currentTask, chunkTasks);
			}

			events.emit("NODE_MOUNTED", node as MountedCriteria, nodePath);
		}
	}

	events.emit("TREE_MOUNTED", rootNode as MountedCriteria);

	return (rootNode as MountedCriteria<T>);
};