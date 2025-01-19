import { VariantCriteria, MountedCriteria, defaultVariantCriteria, formats } from "../formats";
import { SchemaMountingTask } from "./types";
import { LibraryError } from "../utils";
import { Register } from "./register";

export const metadataSymbol = Symbol('metadata');

function checkCriteria(format: typeof formats, definedCriteria: VariantCriteria) {
	
}

export function mounter<T extends VariantCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	const register = new Register();
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];

	const timeStart = performance.now();

	while (queue.length > 0) {
		const { definedCriteria, mountedCriteria } = queue.pop()!;

		const format = formats[definedCriteria.type];
		if (!format) throw new LibraryError(
			"Criteria mounting",
			"Format type '" + String(definedCriteria.type) + "' is unknown"
		);

		Object.assign(mountedCriteria, defaultVariantCriteria, format.defaultCriteria, definedCriteria);
		if (format.mounting) format.mounting(queue, register, definedCriteria, mountedCriteria);
	}

	const timeEnd = performance.now();
	const timeTaken = timeEnd - timeStart;
	Object.assign(mountedCriteria, {
		[metadataSymbol]: {
			mountingTime: `${timeTaken.toFixed(2)}ms`,
			register
		}
	});

	return (mountedCriteria);
};

export function isMountedCriteria(
	criteria: object
): criteria is MountedCriteria<VariantCriteria> {
	return (Reflect.has(criteria, metadataSymbol));
}
