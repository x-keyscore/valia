import type { SetableCriteria, MountedCriteria, GuardedCriteria, Format } from "./formats";
import type { NodePath } from "./services";
import { SchemaDataRejection } from "./utils";
import { Schema } from "./schema";

export interface NodeExceptionReport {
	code: string;
	message: string;
	node: SetableCriteria;
	nodePath: NodePath;
}

export interface DataRejectionReport {
	code: string;
	node: MountedCriteria;
	nodePath: NodePath;
}

export type SchemaEvaluateResult<T extends SetableCriteria> =
	| { rejection: SchemaDataRejection, data: null }
	| { rejection: null, data: GuardedCriteria<MountedCriteria<T>> }

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<MountedCriteria<U>> : never;

export type SchemaInstance<T extends SetableCriteria = SetableCriteria> = InstanceType<typeof Schema<T>>;

export type SchemaParameters<T extends SetableCriteria = SetableCriteria> = ConstructorParameters<typeof Schema<T>>;

export interface SchemaPlugin {
	formats: Format[];
	[key: string | symbol]: any;
}