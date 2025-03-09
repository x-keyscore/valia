import type { SetableCriteria, GuardedCriteria } from "./formats";
import { Schema } from "./schema";
export type SchemaInstance = InstanceType<typeof Schema>;
export type SchemaInfer<I> = I extends Schema<infer T> ? GuardedCriteria<T> : never;
export type SchemaType<T extends SetableCriteria> = typeof Schema<T>;
