import type { FormatsCriteria, FormatsGuard, MountedCriteria } from "../formats";
import { schemaMounter } from "./mounter";
import { schemaChecker } from "./checker";
import { profiler } from "./utils";

export class Schema<DefinedCriteria extends FormatsCriteria> {
	public readonly mountedCriteria: MountedCriteria<DefinedCriteria>;

	constructor(definedCriteria: DefinedCriteria) {
		const profiling = profiler();
		const clonedCriteria = structuredClone(definedCriteria);
		this.mountedCriteria = schemaMounter(clonedCriteria);
		const execTime = profiling.end(2);
		console.log(`Schema build - Execution Time: ${execTime} ms`);
		//console.log(definedCriteria);
	}

	checkGuard(value: unknown): value is FormatsGuard<DefinedCriteria> {
		const { error } = schemaChecker(this.mountedCriteria, value);
		return (!error);
	}

	checkError(value: unknown) {
		const { error } = schemaChecker(this.mountedCriteria, value);
		return (error);
	}
}