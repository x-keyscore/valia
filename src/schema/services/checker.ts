import type { EventsManager, RegistryValue } from "../managers";
import type { CheckingTask, Rejection } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { Issue } from "../../utils";

function rejection(
	eventsManager: EventsManager,
	code: string,
	node: MountedCriteria,
	path: RegistryValue['partPaths']
): Rejection {
	const result = {
		path,
		code: code,
		type: node.type,
		label: node.label,
		message: node.message
	}

	eventsManager.emit("END_OF_CHECKING", node, result);

	return (result);
}

export function checker(
	managers: SchemaInstance['managers'],
	criteria: MountedCriteria,
	value: unknown
): Rejection | null {
	const registryManager = managers.registry;
	const eventsManager = managers.events;
	let queue: CheckingTask[] = [{
		prevPath: { explicit: [], implicit: [] },
		currNode: criteria,
		value
	}];

	while (queue.length > 0) {
		const { prevPath, currNode, value, hooks } = queue.pop()!;

		const partPath = registryManager.getPartPaths(currNode);
		const path = {
			explicit: [...prevPath.explicit, ...partPath.explicit],
			implicit: [...prevPath.implicit, ...partPath.implicit],
		}

		if (hooks) {
			const response = hooks.beforeCheck(currNode);
			if (response === false) continue;
			if (typeof response === "string") {
				return(rejection(
					eventsManager,
					response,
					hooks.owner.node,
					hooks.owner.path
				));
			}
		}

		let reject = null;
		if (value === null) {
			if (currNode.nullable) reject = null;
			else reject = "TYPE_NULL";
		} else if (value === undefined) {
			if (currNode.undefinable) reject = null;
			else reject = "TYPE_UNDEFINED";
		} else {
			const format = managers.formats.get(currNode.type);

			reject = format.checking(queue, path, currNode, value);
		}

		if (hooks) {
			const response = hooks.afterCheck(currNode, reject);
			if (response === false) continue;
			if (typeof response === "string") {
				return(rejection(
					eventsManager,
					response,
					hooks.owner.node,
					hooks.owner.path
				));
			}
		}

		if (reject) {
			return (rejection(eventsManager, reject, currNode, path));
		}

		eventsManager.emit('ONE_NODE_CHECKED', currNode, path);
	}

	return (null);
};