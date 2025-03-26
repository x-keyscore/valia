import type { PathSegments, CheckTask, CheckChunk, CheckReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

function makeReject(
	code: string,
	node: MountedCriteria,
	path: PathSegments
): CheckReject {
	return ({
		code,
		path,
		type: node.type,
		label: node.label,
		message: node.message
	});
}

export class CheckingQueue extends Array<CheckTask> {
	constructor(rootNode: MountedCriteria, rootData: unknown) { 
		super();

		this.push({
			data: rootData,
			node: rootNode,
			fullPaths: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		owner: CheckTask,
		chunk: CheckChunk
	) {
		for (let i = 0; i < chunk.length; i++) {
			const task = chunk[i];
			const partPaths = task.node[nodeSymbol].partPaths;
			let listHooks = owner.listHooks;

			if (task.hooks) {
				const hooks = {
					owner,
					callbacks: task.hooks,
					awaitTasks: 0,
					resetIndex: this.length - 1
				}
	
				listHooks = listHooks ? listHooks.concat(hooks) : [hooks];
			}

			this.push({
				data: task.data,
				node: task.node,
				fullPaths: {
					explicit: owner.fullPaths.explicit.concat(partPaths.explicit),
					implicit: owner.fullPaths.implicit.concat(partPaths.implicit)
				},
				listHooks
			});
		}
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckReject | null {
	const formats = managers.formats;
	const events = managers.events;
	const queue = new CheckingQueue(rootNode, rootData);

	while (queue.length) {
		const task = queue.pop()!;
		const { data, node, fullPaths, listHooks } = task;
		const chunk: CheckChunk = [];

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

		if (listHooks) {
			for (const hooks of listHooks) {
				hooks.awaitTasks += chunk.length - 1;
				
			}
		} 
		
		if (code) {
			return (makeReject(code, node, fullPaths));
		}

		if (chunk.length) {
			queue.pushChunk(task, chunk);
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