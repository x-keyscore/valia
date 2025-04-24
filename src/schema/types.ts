import type { SetableCriteria, GuardedCriteria, Format } from "./formats";
import { Schema } from "./schema";

export interface PluginRequirement {
	formats: Format[];
	[key: PropertyKey]: any;
}

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<U> : never;

export type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;

export type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;
