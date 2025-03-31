import type { CheckingTask, CheckingChunk, CheckingReject } from "./types";
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

export class CheckingStack {
	tasks: CheckingTask[] = [];

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

	addChunk(
		sourceTask: CheckingTask,
		chunk: CheckingChunk
	) {
		for (let i = 0; i < chunk.length; i++) {
			const currentTask = chunk[i];
			const partPaths = currentTask.node[nodeSymbol].partPaths;
			let stepHooks = sourceTask.stepHooks;

			if (currentTask.hooks) {
				const hooks = {
					owner: sourceTask,
					index: {
						chunk: this.tasks.length - i,
						branch: this.tasks.length
					},
					...currentTask.hooks
				}

				stepHooks = stepHooks ? stepHooks.concat(hooks) : [hooks];
			}

			this.tasks.push({
				data: currentTask.data,
				node: currentTask.node,
				fullPaths: {
					explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
					implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
				},
				stepHooks
			});
		}
	}

	runHooks(
		currentTask: CheckingTask,
		reject: CheckingReject | null
	) {
		const stepHooks = currentTask.stepHooks;
		if (!stepHooks) return (null);

		const lastHooks = stepHooks[stepHooks.length - 1];
		if (!reject && lastHooks.index.branch !== this.tasks.length) {
			return (null);
		}

		for (let i = stepHooks.length - 1; i >= 0; i--) {
			const hooks = stepHooks[i];

			const claim = reject ? hooks.onReject(reject) : hooks.onAccept();

			switch (claim.action) {
				case "DEFAULT":
					this.tasks.length = hooks.index.branch;
					if (!reject) return (null);
					continue;
				case "REJECT":
					this.tasks.length = hooks.index.branch;
					reject = makeReject(hooks.owner, claim.code);
					continue;
				case "IGNORE":
					if (claim?.target === "CHUNK") {
						this.tasks.length = hooks.index.chunk;
					} else {
						this.tasks.length = hooks.index.branch;
					}
					return (null);
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
	const { formats, events } = managers;
	const stack = new CheckingStack(rootNode, rootData);

	let reject = null;
	while (stack.tasks.length) {
		const currentTask = stack.tasks.pop()!;
		const { data, node, stepHooks } = currentTask;
		const chunk: CheckingChunk = [];

		let code = null;
		if (data === null) {
			if (!node.nullable) code = "TYPE_NULL";
		}
		else if (data === undefined) {
			if (!node.undefinable) code = "TYPE_UNDEFINED";
		}
		else {
			const format = formats.get(node.type);
			code = format.check(chunk, node, data);
		}

		if (code) reject = makeReject(currentTask, code);
		else if (chunk.length) stack.addChunk(currentTask, chunk);
		if (stepHooks) reject = stack.runHooks(currentTask, reject);

		if (reject) break;
	}

	events.emit("DATA_CHECKED", rootNode, rootData, reject);

	return (reject);
};