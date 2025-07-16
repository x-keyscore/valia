import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MounterTask, MounterChunk, CommonErrorCodes } from "./types";
import type { SchemaInstance } from "../types";
import { SchemaNodeException } from "../utils";

export const nodeSymbol = Symbol("node");

const commonErrors: Record<string, string> = {
	TYPE_PROPERTY_REQUIRED:
		"",
	TYPE_PROPERTY_MALFORMED:
		"",
	TYPE_PROPERTY_MISCONFIGURED:
		"",
	LABEL_PROPERTY_MALFORMED:
		"",
	MESSAGE_PROPERTY_MALFORMED:
		"",
	NULLABLE_PROPERTY_MALFORMED:
		""
} satisfies Record<CommonErrorCodes, string>;

function commonMount(
	managers: SchemaInstance['managers'],
	node: SetableCriteria
): CommonErrorCodes | null {
	const { type, label, message, nullable } = node;

	if (!("type" in node)) {
		return ("TYPE_PROPERTY_REQUIRED");
	}
	if (typeof type !== "string") {
		return ("TYPE_PROPERTY_MALFORMED");
	}
	if (!managers.formats.has(type)) {
		return ("TYPE_PROPERTY_MISCONFIGURED");
	}
	if (label !== undefined && typeof label !== "string") {
		return ("LABEL_PROPERTY_MALFORMED");
	}
	if (message !== undefined && typeof message !== "string") {
		return ("MESSAGE_PROPERTY_MALFORMED");
	}
	if (nullable !== undefined && typeof nullable !== "boolean") {
		return ("NULLABLE_PROPERTY_MALFORMED");
	}

	return (null);
}

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
			partPath: { explicit: [], implicit: [] },
			fullPath: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		sourceTask: MounterTask,
		chunk: MounterChunk
	) {
		const {
			explicit: fullPathExplicit,
			implicit: fullPathImplicit
		} = sourceTask.fullPath;

		for (let i = 0; i < chunk.length; i++) {
			const { node, partPath } = chunk[i];

			this.tasks.push({
				node,
				partPath,
				fullPath: {
					explicit: partPath.explicit
						? fullPathExplicit.concat(partPath.explicit)
						: fullPathExplicit,
					implicit: partPath.implicit
						? fullPathImplicit.concat(partPath.implicit)
						: fullPathImplicit
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
		const { node, partPath, fullPath } = currentTask;

		if (hasNodeSymbol(node)) {
			node[nodeSymbol] = {
				...node[nodeSymbol],
				partPath
			}
		} else {
			let code: string | null = null;

			code = commonMount(managers, node);
			if (code) {
				throw new SchemaNodeException({
					code: code,
					node: node,
					nodePath: fullPath,
					message: commonErrors[code]
				});
			}

			const chunk: MounterChunk = [];
			const format = formats.get(node.type);

			code = format.mount(chunk, node);
			if (code) {
				throw new SchemaNodeException({
					code: code,
					node: node,
					nodePath: fullPath,
					message: format.errors[code]
				});
			}

			Object.assign(node, {
				[nodeSymbol]: {
					partPath,
					childNodes: chunk.map((task) => task.node)
				}
			});
			Object.freeze(node);

			if (chunk.length) stack.pushChunk(currentTask, chunk);

			events.emit("NODE_MOUNTED", node as MountedCriteria, fullPath);
		}
	}

	events.emit("TREE_MOUNTED", rootNode as MountedCriteria<T>);

	return (rootNode as MountedCriteria<T>);
};