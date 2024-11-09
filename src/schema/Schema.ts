import type { InputSchema, BuildedSchema } from "./types";
import { FormatsCriteria, FormatGuard } from "../formats";
import { schemaBuilder } from "./builder";
import { schemaChecker } from "./checker";


export class Schema<DefinedSchema extends InputSchema> {
	public readonly defined: DefinedSchema;
	public readonly builded: BuildedSchema;

	/*
	If the type defined on "inputSchema" is "InputSchema"
	instead of type "InputSchema", this is to enable strong
	typing when defining the schema in the constructor.
	This also displays comments defined on the criteria.
	*/
	constructor(inputSchema: DefinedSchema) {
		this.defined = inputSchema as DefinedSchema;
		const start = performance.now();
		this.builded = schemaBuilder(inputSchema);
		const end = performance.now();
		const timeTaken = end - start;
		console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
		console.log(this.builded)
	}

	check(input: unknown): input is FormatGuard<DefinedSchema> {
		const result = schemaChecker(input, this.builded);
		console.log(result)
		return (!result.error);
	}
}
