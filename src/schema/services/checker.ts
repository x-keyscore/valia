import type { CheckerTask, CheckerChunk, CheckerReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

function createReject(
	task: CheckerTask,
	code: string
): CheckerReject {
	return ({
		code,
		path: task.fullPaths,
		type: task.node.type,
		label: task.node.label,
		message: task.node.message
	});
}

export class CheckerStack {
	tasks: CheckerTask[] = [];

	constructor(
		rootNode: MountedCriteria,
		rootData: unknown
	) {
		this.tasks.push({
			data: rootData,
			node: rootNode,
			fullPaths: { explicit: [], implicit: [] }
		});
	}

	pushChunk(
		sourceTask: CheckerTask,
		chunk: CheckerChunk
	) {
		for (let i = 0; i < chunk.length; i++) {
			const currentTask = chunk[i];
			const partPaths = currentTask.node[nodeSymbol].partPaths;
			let stackHooks = sourceTask.stackHooks;

			if (currentTask.hooks) {
				const hooks = {
					owner: sourceTask,
					index: {
						chunk: this.tasks.length - i,
						branch: this.tasks.length
					},
					...currentTask.hooks
				}

				stackHooks = stackHooks ? stackHooks.concat(hooks) : [hooks];
			}

			this.tasks.push({
				data: currentTask.data,
				node: currentTask.node,
				fullPaths: {
					explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
					implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
				},
				stackHooks
			});
		}
	}

	callHooks(
		currentTask: CheckerTask,
		reject: CheckerReject | null
	): CheckerReject | null {
		const stackHooks = currentTask.stackHooks;
		if (!stackHooks) return (null);

		const lastHooks = stackHooks[stackHooks.length - 1];
		if (!reject && lastHooks.index.branch !== this.tasks.length) {
			return (null);
		}

		loop: for (let i = stackHooks.length - 1; i >= 0; i--) {
			const hooks = stackHooks[i];

			const claim = reject ? hooks.onReject(reject) : hooks.onAccept();

			switch (claim.action) {
				case "DEFAULT":
					this.tasks.length = hooks.index.branch;
					if (!reject) {
						reject = null;
						break loop;
					}
					continue;
				case "REJECT":
					this.tasks.length = hooks.index.branch;
					reject = createReject(hooks.owner, claim.code);
					continue;
				case "IGNORE":
					if (claim?.target === "CHUNK") {
						this.tasks.length = hooks.index.chunk;
					} else {
						this.tasks.length = hooks.index.branch;
					}
					reject = null;
					break loop;
			}
		}

		return (reject);
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckerReject | null {
	const { formats, events } = managers;
	const stack = new CheckerStack(rootNode, rootData);

	let reject: CheckerReject | null = null;
	while (stack.tasks.length) {
		const currentTask = stack.tasks.pop()!;
		const { data, node, stackHooks } = currentTask;
		const chunk: CheckerChunk = [];

		let code = null;
		if (!(node.nullish && data == null)) {
			const format = formats.get(node.type);
			code = format.check(chunk, node, data);
		}

		if (code) reject = createReject(currentTask, code);
		else if (chunk.length) stack.pushChunk(currentTask, chunk);
		if (stackHooks) reject = stack.callHooks(currentTask, reject);

		if (reject) break;
	}

	events.emit("DATA_CHECKED", rootNode, rootData, reject);

	return (reject);
};