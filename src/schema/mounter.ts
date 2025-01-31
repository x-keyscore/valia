import type { SchemaMountingTask } from "./types";
import { VariantCriteria, MountedCriteria, defaultVariantCriteria, formats } from "./formats";
import { Registry, registrySymbol } from "./Registry";
import { Err } from "../utils";

export function mounter<T extends VariantCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	const registry = new Registry();
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];

	registry.add(null, mountedCriteria, {
		pathParts: ["root"]
	});

	while (queue.length > 0) {
		const { definedCriteria, mountedCriteria } = queue.pop()!;

		const format = formats[definedCriteria.type];
		if (!format) throw new Err(
			"Criteria mounting",
			"Format type '" + String(definedCriteria.type) + "' is unknown"
		);

		Object.assign(mountedCriteria, defaultVariantCriteria, format.defaultCriteria, definedCriteria);

		if (format.mounting) format.mounting(queue, registry, definedCriteria, mountedCriteria);
	}

	Object.assign(mountedCriteria, {
		[registrySymbol]: registry
	});

	return (mountedCriteria);
};

export function isMountedCriteria(
	criteria: object
): criteria is MountedCriteria<VariantCriteria> {
	return (Reflect.has(criteria, registrySymbol));
}
