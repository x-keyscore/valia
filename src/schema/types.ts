import type { SetableCriteria, MountedCriteria, GuardedCriteria, Format } from "./formats";
import type { CheckerReject } from "./services";
import { Schema } from "./schema";

export type SchemaEvaluate<T extends SetableCriteria> =
	| { reject: CheckerReject, data: null }
	| { reject: null, data: GuardedCriteria<MountedCriteria<T>> }

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<MountedCriteria<U>> : never;

export type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;

export type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;

export interface SchemaPlugin {
	formats: Format[];
	[key: string | symbol]: any;
}