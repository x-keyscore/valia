import type { TunableCriteria, GuardedCriteria } from "./formats";
import type { CheckerReject } from "./services/types";
import { Schema } from "./Schema";

// ALIASES FOR BETTER DX

export type SchemaReject = CheckerReject;

export type SchemaInfer<T> = T extends Schema<infer U> ? GuardedCriteria<U> : never;

export type CriteriaInfer<T> = T extends TunableCriteria ? GuardedCriteria<T> : never;

export type SchemaType<T extends TunableCriteria = TunableCriteria> = typeof Schema<T>;