import type { SetableCriteria, GuardedCriteria } from "./formats";
import type { CheckerReject } from "./services";
import { Schema } from "./schema";

export type SchemaInstance = InstanceType<typeof Schema>;

export type SchemaReject = CheckerReject;

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<U> : never;

export type SchemaType<T extends SetableCriteria = SetableCriteria> = typeof Schema<T>;