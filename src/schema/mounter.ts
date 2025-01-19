import { VariantCriteria, MountedCriteria, defaultVariantCriteria, formats } from "./formats";
import { SchemaMountingTask } from "./types";
import { LibraryError } from "../utils";
import { Register } from "./register";

export const registerSymbol = Symbol('register');

function checkCriteria(format: typeof formats, definedCriteria: VariantCriteria) {

}

export function mounter<T extends VariantCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	const register = new Register();
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];

	while (queue.length > 0) {
		// RETRIVE THE PROPERTIES OF THE CURRENT TASK
		const { definedCriteria, mountedCriteria } = queue.pop()!;

		// RETRIVE THE FORMAT
		const format = formats[definedCriteria.type];
		if (!format) throw new LibraryError(
			"Criteria mounting",
			"Format type '" + String(definedCriteria.type) + "' is unknown"
		);

		// ASSIGNING DEFAULT CRITERIA AND DEFINED CRITERIA ON THE MOUNTED CRITERIA REFERENCE
		Object.assign(mountedCriteria, defaultVariantCriteria, format.defaultCriteria, definedCriteria);

		// FORMAT SPECIFIC MOUNTING
		if (format.mounting) format.mounting(queue, register, definedCriteria, mountedCriteria);
	}

	// REGISTER ASSIGNMENT ON THE ROOT OF RHE MOUNTED CRITERIA
	Object.assign(mountedCriteria, {
		[registerSymbol]: register
	});

	return (mountedCriteria);
};

export function isMountedCriteria(
	criteria: object
): criteria is MountedCriteria<VariantCriteria> {
	return (Reflect.has(criteria, registerSymbol));
}
