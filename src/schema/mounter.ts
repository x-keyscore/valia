import type { SchemaMountingTask } from "./types";
import { VariantCriteria, MountedCriteria, defaultVariantCriteria, formats } from "./formats";
import { Mapper, mapperSymbol } from "./Mapper";
import { Err } from "../utils";

export function mounter<T extends VariantCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];
	const mapper = new Mapper(mountedCriteria, {
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

		if (format.mounting) format.mounting(queue, mapper, definedCriteria, mountedCriteria);

		Object.assign(mountedCriteria, {
			[mapperSymbol]: mapper
		});
	}

	return (mountedCriteria);
};

export function isMountedCriteria(
	criteria: object
): criteria is MountedCriteria<VariantCriteria> {
	return (Reflect.has(criteria, mapperSymbol));
}
