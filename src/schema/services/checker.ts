import type { CheckerTask, CheckerChunk, CheckerRejection } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { nodeSymbol } from "./mounter";

export class CheckerStack {
	tasks: CheckerTask[] = [];

	constructor(
		rootNode: MountedCriteria,
		rootData: unknown
	) {
		this.tasks.push({
			data: rootData,
			node: rootNode,
			fullPath: { explicit: [], implicit: [] }
		});
	}

	pushChunk(
		sourceTask: CheckerTask,
		chunk: CheckerChunk
	): void {
		const {
			explicit: fullPathExplicit,
			implicit: fullPathImplicit
		} = sourceTask.fullPath;

		for (let i = 0; i < chunk.length; i++) {
			const task = chunk[i];
			const partPath = task.node[nodeSymbol].partPath;
			let stackHooks = sourceTask.stackHooks;

			if (task.hooks) {
				const hooks = {
					taskOwner: sourceTask,
					stackIndex: {
						chunk: this.tasks.length - i,
						branch: this.tasks.length
					},
					...task.hooks
				}

				stackHooks = stackHooks ? stackHooks.concat(hooks) : [hooks];
			}

			this.tasks.push({
				data: task.data,
				node: task.node,
				fullPath: {
					explicit: partPath.explicit
						? fullPathExplicit.concat(partPath.explicit)
						: fullPathExplicit,
					implicit: partPath.implicit
						? fullPathImplicit.concat(partPath.implicit)
						: fullPathImplicit
				},
				stackHooks
			});
		}
	}

	callHooks(
		sourceTask: CheckerTask,
		rejection: CheckerRejection | null
	): CheckerRejection | null {
		const stackHooks = sourceTask.stackHooks;
		if (!stackHooks) return (null);

		const lastHooks = stackHooks[stackHooks.length - 1];
		if (!rejection && lastHooks.stackIndex.branch !== this.tasks.length) {
			return (null);
		}

		loop: for (let i = stackHooks.length - 1; i >= 0; i--) {
			const hooks = stackHooks[i];

			const claim = rejection ? hooks.onReject(rejection) : hooks.onAccept();

			switch (claim.action) {
				case "DEFAULT":
					this.tasks.length = hooks.stackIndex.branch;
					if (!rejection) {
						rejection = null;
						break loop;
					}
					continue;
				case "REJECT":
					this.tasks.length = hooks.stackIndex.branch;
					rejection = { task: hooks.taskOwner, code: claim.code };
					continue;
				case "IGNORE":
					if (claim?.target === "CHUNK") {
						this.tasks.length = hooks.stackIndex.chunk;
					} else {
						this.tasks.length = hooks.stackIndex.branch;
					}
					rejection = null;
					break loop;
			}
		}

		return (rejection);
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckerRejection | null {
	const { formats, events } = managers;
	const stack = new CheckerStack(rootNode, rootData);

	let rejection: CheckerRejection | null = null;
	while (stack.tasks.length) {
		const currentTask = stack.tasks.pop()!;
		const { data, node, stackHooks } = currentTask;
		const chunk: CheckerChunk = [];

		let code: string | null = null;
		if (!(node.nullable && data === null)) {
			const format = formats.get(node.type)!;
			code = format.check(chunk, node, data);
		}

		if (code) rejection = { task: currentTask, code };
		else if (chunk.length) stack.pushChunk(currentTask, chunk);
		if (stackHooks) rejection = stack.callHooks(currentTask, rejection);

		if (rejection) break;
	}

	events.emit("DATA_CHECKED", rootNode, rootData, rejection);

	return (rejection);
};

