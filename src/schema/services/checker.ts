import type { EventsManager, RegistryValue } from "../managers";
import type { CheckingTask, Reject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { formats } from "../formats";
import { Issue } from "../../utils";

function reject(
	eventsManager: EventsManager,
	code: string,
	node: MountedCriteria,
	path: RegistryValue['partPaths']
): Reject {
	const obj = {
		path,
		code: code,
		type: node.type,
		label: node.label,
		message: node.message
	}

	eventsManager.emit('NODE_CHECKED', node, path, obj);

	return (obj);
}

export function checker(
	managers: SchemaInstance['managers'],
	criteria: MountedCriteria,
	value: unknown
): Reject | null {
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
				return(reject(
					eventsManager,
					response,
					hooks.owner.node,
					hooks.owner.path
				));
			}
		}

		let state = null;
		if (value === null) {
			if (currNode.nullable) state = null;
			else state = "TYPE_NULL";
		} else if (value === undefined) {
			if (currNode.undefinable) state = null;
			else state = "TYPE_UNDEFINED";
		} else {
			const format = formats[currNode.type];
			if (!format) throw new Issue(
				"Checking",
				"Type '" + currNode.type + "' is unknown."
			);

			state = format.checking(queue, path, currNode, value);
		}

		if (hooks) {
			const response = hooks.afterCheck(currNode, state);
			if (response === false) continue;
			if (typeof response === "string") {
				return(reject(
					eventsManager,
					response,
					hooks.owner.node,
					hooks.owner.path
				));
			}
		}

		if (state) {
			return (reject(eventsManager, state, currNode, path));
		}

		eventsManager.emit('NODE_CHECKED', currNode, path, null);
	}

	return (null);
};