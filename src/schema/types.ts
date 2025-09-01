import type { SetableCriteria, MountedCriteria, GuardedCriteria, Format } from "./formats";
import type { CheckerResult } from "./services/types";
import { Schema } from "./schema";

export type SchemaEvaluateResult<GuardedData = unknown> = CheckerResult<GuardedData>;

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<MountedCriteria<U>> : never;

export type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;

export type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;

export interface SchemaPlugin {
	formats: Format[];
	[key: string | symbol]: any;
}