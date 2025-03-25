import type { PathSegments, CheckingTask, CheckerReject, CheckingTaskHooks, CheckingTaskCallbacks } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

function reject(
	code: string,
	node: MountedCriteria,
	path: PathSegments,
): CheckerReject {
	return ({
		code,
		path,
		type: node.type,
		label: node.label,
		message: node.message
	});
}

export class CheckingChunk extends Array<CheckingTask> {
	constructor(
		public queue: CheckingTask[],
		public owner: CheckingTask
	) {
		super();
	}

	addTask(
		task: {
			data: unknown;
			node: MountedCriteria;
			hooks?: CheckingTaskCallbacks
		}
	) {
		const partPaths = task.node[nodeSymbol].partPaths;
		let branchHooks = this.owner.branchHooks;

		if (task.hooks && Object.keys(task.hooks)) {
			const hooks = {
				owner: this.owner,
				callbacks: task.hooks,
				awaitTasks: 0,
				resetIndex: this.queue.length - 1
			}

			branchHooks = branchHooks ? branchHooks.concat(hooks) : [hooks];
		}

		this.push({
			data: task.data,
			node: task.node,
			fullPaths: {
				explicit: this.owner.fullPaths.explicit.concat(partPaths.explicit),
				implicit: this.owner.fullPaths.implicit.concat(partPaths.implicit)
			},
			branchHooks
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

	while (queue.length) {
		const task = queue.pop()!;
		const chunk = new CheckingChunk(queue, task);
		const { data, node, fullPaths, branchHooks } = task;

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

		if (chunk.length) {
			queue.push(...chunk);
		}
	}

	events.emit("TREE_CHECKED", rootNode, null);

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