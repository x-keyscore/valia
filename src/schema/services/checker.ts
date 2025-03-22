import type { PathSegments, CheckingTask, CheckingTaskHooks, CheckerReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

function reject(
	code: string,
	node: MountedCriteria,
	path: PathSegments,
): CheckerReject {
	return ({
		path,
		code: code,
		type: node.type,
		label: node.label,
		message: node.message
	});
}

export class CheckingChunk extends Array<CheckingTask> {
	constructor(public paths: PathSegments) {
		super();
	}

	addTask(
		task: {
			data: unknown;
			node: MountedCriteria;
			hooks?: CheckingTaskHooks;
		}
	) {
		const partPaths = task.node[nodeSymbol].partPaths;

		this.push({
			data: task.data,
			node: task.node,
			fullPaths: {
				explicit: [...this.paths.explicit, ...partPaths.explicit],
				implicit: [...this.paths.implicit, ...partPaths.implicit]
			}
		});
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckerReject | null {
	const formats = managers.formats;
	const events = managers.events;
	const queue: CheckingTask[] = [{
		data: rootData,
		node: rootNode,
		fullPaths: { explicit: [], implicit: [] }
	}];

	while (queue.length > 0) {
		const { data, node, fullPaths } = queue.pop()!;
		const chunk = new CheckingChunk(fullPaths);

		let code = null;
		if (data === null) {
			if (node.nullable) code = null;
			else code = "TYPE_NULL";
		} else if (data === undefined) {
			if (node.undefinable) code = null;
			else code = "TYPE_UNDEFINED";
		} else {
			const format = formats.get(node.type);

			code = format.check(chunk, node, data);
		}

		if (code) {
			return (reject(code, node, fullPaths));
		}

		queue.push(...chunk);

		events.emit('ONE_NODE_CHECKED', node, fullPaths);
	}

	events.emit("END_OF_CHECKING", rootNode, null);

	return (null);
};

/*
if (hooks) {
	const response = hooks.beforeCheck(currNode);
	if (response === false) continue;
	if (typeof response === "string") {
		return(rejection(
			events,
			response,
			hooks.owner.node,
			hooks.owner.path
		));
	}
}*/

/*
if (hooks) {
	const response = hooks.afterCheck(currNode, code);
	if (response === false) continue;
	if (typeof response === "string") {
		return(rejection(
			events,
			response,
			hooks.owner.node,
			hooks.owner.path
		));
	}
}*/