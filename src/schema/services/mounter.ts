import type { SetableCriteria, MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import type { MountingTask } from "./types";
import { staticDefaultCriteria, formats } from "../formats";
import { Issue } from "../../utils";

export const metadataSymbol = Symbol('matadata');

export function isMountedCriteria(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, metadataSymbol));
}

export function mounter<T extends SetableCriteria>(
	managers: SchemaInstance['managers'],
	criteria: SetableCriteria & T
): MountedCriteria<T> {
	const registryManager = managers.registry;
	const eventsManager = managers.events;
	let queue: MountingTask[] = [{
		prevNode: null,
		prevPath: { explicit: [], implicit: [] },
		currNode: criteria,
		partPath: { explicit: [], implicit: [] },
	}];

	while (queue.length > 0) {
		const { prevNode, prevPath, currNode, partPath } = queue.pop()!;

		const path = {
			explicit: [...prevPath.explicit, ...partPath.explicit],
			implicit: [...prevPath.implicit, ...partPath.implicit],
		}

		registryManager.set(prevNode, currNode, partPath);

		if (isMountedCriteria(currNode)) {
			registryManager.junction(currNode);
		} else {
			const format = formats[currNode.type];
			if (!format) throw new Issue(
				"Mounting",
				"Type '" + currNode.type + "' is unknown."
			);

			format.mounting?.(queue, path, currNode);

			Object.assign(currNode, {
				...staticDefaultCriteria,
				...format.defaultCriteria,
				...currNode
			});
		}

		Object.assign(currNode, {
			[metadataSymbol]: {
				registry: registryManager.registry,
				saveNode: currNode
			}
		});

		eventsManager.emit(
			"NODE_MOUNTED",
			currNode as MountedCriteria,
			path
		);
	}

	eventsManager.emit("FULL_MOUNTED");

	return (criteria as MountedCriteria<T>);
};