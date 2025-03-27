import type { CheckingTask, CheckingHooks, CheckingChunk, CheckingReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

function makeReject(
	task: CheckingTask,
	code: string
): CheckingReject {
	return ({
		code,
		path: task.fullPaths,
		type: task.node.type,
		label: task.node.label,
		message: task.node.message
	});
}

export class CheckingQueue extends Array<CheckingTask> {
	constructor(rootNode: MountedCriteria, rootData: unknown) { 
		super();

		this.push({
			data: rootData,
			node: rootNode,
			fullPaths: { explicit: [], implicit: [] }
		})
	}

	pushChunk(
		sourceTask: CheckingTask,
		chunk: CheckingChunk
	) {
		for (let i = 0; i < chunk.length; i++) {
			const task = chunk[i];
			const partPaths = task.node[nodeSymbol].partPaths;
			let listHooks = sourceTask.listHooks;

			if (task.hooks) {
				const hooks = {
					sourceTask,
					awaitTasks: 0,
					queueIndex : {
						branch: this.length,
						chunk: this.length - i
					},
					callbacks: task.hooks,
				}
	
				if (listHooks) {
					listHooks = listHooks.concat(hooks);
				} else {
					listHooks = [hooks];
				}
			}

			this.push({
				data: task.data,
				node: task.node,
				fullPaths: {
					explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
					implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
				},
				listHooks
			});
		}
	}

	execHooks(
		listHooks: CheckingHooks[],
		code: string | null
	) {
		let reject = null;

		for (let i = listHooks.length - 1; i >= 0; i--) {
			const hooks = listHooks[i];

			// EXECUTE CALLBACKS
			let claim = null;
			if (code) {
				claim = hooks.callbacks.onReject(code);
			}
			else if (this.length === hooks.queueIndex.branch) {
				claim = hooks.callbacks.onAccept();
			}
			else {
				return (null);
			}

			if (claim.action === "BYPASS") {
				if (claim.target === "CHUNK") {
					this.length = hooks.queueIndex.chunk;
				} else if (claim.target === "BRANCH") {
					this.length = hooks.queueIndex.branch;
				}
				return (null);
			}

			if (claim.action === "REJECT") {
				this.length = hooks.queueIndex.branch;
				code = claim.code;
				reject = makeReject(hooks.sourceTask, code);
			}
		}

		return (reject);
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckingReject | null {
	const formats = managers.formats;
	const events = managers.events;
	const queue = new CheckingQueue(rootNode, rootData);
	let reject = null;

	while (queue.length) {
		const currentTask = queue.pop()!;
		const { data, node, listHooks } = currentTask;
		const chunk: CheckingChunk = [];

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
			reject = queue.execHooks(listHooks, code);
		} else if (code) {
			reject = makeReject(currentTask, code);
		}

		if (chunk.length) {
			queue.pushChunk(currentTask, chunk);
		}
	}

	events.emit("DATA_CHECKED", rootNode, rootData, reject);

	return (reject);
};
