import type { GuardedCriteria } from "./formats";
import { Schema } from "./schema";
export type SchemaInstance = InstanceType<typeof Schema>;
export type SchemaInfer<I> = I extends Schema<infer T> ? GuardedCriteria<T> : never;
