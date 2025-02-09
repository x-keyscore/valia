import type { TunableCriteria, MountedCriteria } from "../formats";
import type { MountingTask } from "./types";
import { formats, staticTunableCriteria } from "../formats";
import { MapperInstance, mapperSymbol } from "../handlers";
import { isPlainObject } from "../../testers";
import { Err } from "../../utils";

export function mounter<T extends TunableCriteria>(
	mapper: MapperInstance,
	definedCriteria: T
): MountedCriteria<T> {
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: MountingTask[] = [{ definedCriteria, mountedCriteria }];

	mapper.add(null, mountedCriteria, {
		pathParts: ["root"]
	});

	while (queue.length > 0) {
		const { definedCriteria, mountedCriteria } = queue.pop()!;

		const format = formats[definedCriteria.type];
		if (!format) throw new Err(
			"Criteria mounting",
			"Type '" + String(definedCriteria.type) + "' is unknown."
		);

		Object.assign(mountedCriteria, staticTunableCriteria, format.defaultCriteria, definedCriteria);

		if (format.mounting) format.mounting(queue, mapper, definedCriteria, mountedCriteria);

		Object.assign(mountedCriteria, {
			[mapperSymbol]: mapper
		});
	}

	return (mountedCriteria);
};

export function isMountedCriteria(obj: object): obj is MountedCriteria<TunableCriteria> {
	return (isPlainObject(obj) && Reflect.has(obj, mapperSymbol));
}
