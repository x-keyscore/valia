import type { SetableCriteria, MountedCriteria } from "../formats";
import type { EventsManager, RegistryManager } from "../managers";
import type { MountingTask } from "./types";
import { staticDefaultCriteria, formats } from "../formats";
import { Issue } from "../../utils";

export const metadataSymbol = Symbol('matadata');

export function isMountedCriteria(obj: object): obj is MountedCriteria {
	return (typeof obj === "object" && Reflect.has(obj, metadataSymbol));
}

export function mounter<T extends SetableCriteria>(
	registryManager: RegistryManager,
	eventsManager: EventsManager,
	clonedCriteria: SetableCriteria & T
): MountedCriteria<T> {
	let queue: MountingTask[] = [{
		prevCriteria: null,
		prevPath: { explicit: [], implicit: [] },
		criteria: clonedCriteria,
		pathSegments: { explicit: [], implicit: [] }
	}];

	while (queue.length > 0) {
		const { prevCriteria, prevPath, criteria, pathSegments } = queue.pop()!;

		const path = {
			explicit: [...prevPath.explicit, ...pathSegments.explicit],
			implicit:  [...prevPath.implicit, ...pathSegments.implicit],
		}

		registryManager.set(prevCriteria, criteria, pathSegments);

		if (isMountedCriteria(criteria)) {
			registryManager.junction(criteria);
		} else {
			const format = formats[criteria.type];
			if (!format) throw new Issue(
				"Mounting",
				"Type '" + criteria.type + "' is unknown."
			);

			format.mounting?.(queue, path, criteria);

			Object.assign(criteria, {
				...staticDefaultCriteria,
				...format.defaultCriteria,
				...criteria
			});
		}

		Object.assign(criteria, {
			[metadataSymbol]: {
				registryKey: criteria,
				registry: registryManager.registry
			}
		});

		eventsManager.emit(
			"CRITERIA_NODE_MOUNTED",
			criteria as MountedCriteria,
			path
		);
	}

	return (clonedCriteria as MountedCriteria<T>);
};