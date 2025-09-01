import type { CheckerTask, CheckerHook, CheckerChunkTask, CheckerRejection, CheckerResult } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { SchemaDataRejection, SchemaDataAdmission } from "../utils";
import { nodeSymbol } from "./mounter";

export class CheckerStack {
	tasks: CheckerTask[] = [];
	hooks: CheckerHook[] = [];

	constructor(
		rootNode: MountedCriteria,
		rootData: unknown
	) {
		this.tasks.push({
			data: rootData,
			node: rootNode,
			nodePath: { explicit: [], implicit: [] },
			closerHook: null
		});
	}

	pushChunk(
		sourceTask: CheckerTask,
		chunk: CheckerChunkTask[]
	): void {
		const prevCloserHook = sourceTask.closerHook;
		const prevNodePath = sourceTask.nodePath;

		const staskTaskLength = this.tasks.length;
		const stackHookLength = this.hooks.length;
		const chunkTaskLength = chunk.length;

		let chunkTaskIndex = 0, chunkHookCount = 0;
		while (chunkTaskIndex < chunkTaskLength) {
			const { data, node, hook } = chunk[chunkTaskIndex];
			const partPath = node[nodeSymbol].partPath;
			let closerHook = prevCloserHook;

			if (hook) {
				closerHook = {
					...hook,
					sourceTask,
					chunkTaskIndex: staskTaskLength,
					branchTaskIndex: staskTaskLength + chunkTaskIndex,
					chunkHookIndex: stackHookLength,
					branchHookIndex: stackHookLength + chunkHookCount
				}
				this.hooks.push(closerHook);

				chunkHookCount++;
			}

			this.tasks.push({
				data,
				node,
				nodePath: {
					explicit: partPath.explicit
						? prevNodePath.explicit.concat(partPath.explicit)
						: prevNodePath.explicit,
					implicit: partPath.implicit
						? prevNodePath.implicit.concat(partPath.implicit)
						: prevNodePath.implicit
				},
				closerHook
			});

			chunkTaskIndex++;
		}
	}

	playHooks(
		closerHook: CheckerHook,
		rejection: CheckerRejection | null
	): CheckerRejection | null {
		if (!rejection && closerHook.branchTaskIndex !== this.tasks.length) {
			return (null);
		}

		let currentHook = closerHook;
		while (currentHook) {
			const result = rejection
				? currentHook.onReject(rejection)
				: currentHook.onAccept();

			switch (result.action) {
				case "REJECT":
					this.tasks.length = currentHook.branchTaskIndex;
					this.hooks.length = currentHook.branchHookIndex;
					rejection = {
						issuerTask: currentHook.sourceTask,
						code: result.code
					};
					break;
				case "CANCEL":
					if (result.target === "CHUNK") {
						this.tasks.length = currentHook.chunkTaskIndex;
						this.hooks.length = currentHook.chunkHookIndex;
					}
					else if (result.target === "BRANCH") {
						this.tasks.length = currentHook.branchTaskIndex;
						this.hooks.length = currentHook.branchHookIndex;
					}
					return (null);
			}

			if (rejection || currentHook.chunkHookIndex === 0) break;

			currentHook = this.hooks[currentHook.chunkHookIndex];
		}

		return (rejection);
	}
}

export function checker(
	managers: SchemaInstance['managers'],
	rootNode: MountedCriteria,
	rootData: unknown
): CheckerResult {
	const { formats, events } = managers;
	const stack = new CheckerStack(rootNode, rootData);
	let rejection: CheckerRejection | null = null;

	let loopCount = 0;
	while (stack.tasks.length) {
		const currentTask = stack.tasks.pop()!;
		const { data, node, closerHook } = currentTask;

		const format = formats.get(node.type);
		const chunkTasks: CheckerChunkTask[] = [];

		const code = format.check(chunkTasks, node, data);

		if (chunkTasks.length) {
			stack.pushChunk(currentTask, chunkTasks);
		}

		if (code) {
			rejection = { issuerTask: currentTask, code };
		}

		if (closerHook) {
			rejection = stack.playHooks(closerHook, rejection);
		}

		if (rejection) break;

		loopCount++;
	}

	if (rejection) {
		const rejectionInstance = new SchemaDataRejection(
			rootData,
			rootNode,
			rejection.code,
			rejection.issuerTask.data,
			rejection.issuerTask.node,
			rejection.issuerTask.nodePath
		);

		events.emit("DATA_REJECTED", rejectionInstance);
		return ({
			success: false,
			rejection: rejectionInstance,
			admission: null
		});
	}

	const admissionInstance = new SchemaDataAdmission(
		rootData,
		rootNode
	);

	events.emit("DATA_ADMITTED", admissionInstance);
	return ({
		success: true,
		rejection: null,
		admission: admissionInstance
	});
};