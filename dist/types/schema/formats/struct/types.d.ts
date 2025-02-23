import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, SetableCriteria, GuardedCriteria, MountedCriteria } from "../types";
export type SetableStruct = {
    [key: string | symbol]: SetableCriteria | SetableStruct;
};
export interface StructSetableCriteria extends SetableCriteriaTemplate<"struct"> {
    optional?: (string | symbol)[];
    struct: SetableStruct;
}
export interface StructClassicTypes extends ClassicTypesTemplate<StructSetableCriteria, {}> {
}
type SimulateStruct<T> = StructSetableCriteria & {
    struct: T;
};
type MountedStruct<T extends SetableStruct> = {
    [K in keyof T]: T[K] extends SetableCriteria ? MountedCriteria<T[K]> : T[K] extends SetableStruct ? MountedCriteria<SimulateStruct<T[K]>> : T[K] extends (SetableCriteria | SetableStruct) ? MountedCriteria<SetableCriteria> : T[K];
};
interface StructMountedCriteria<T extends StructSetableCriteria> {
    struct: MountedStruct<T['struct']>;
    acceptedKeys: (string | symbol)[];
    requiredKeys: (string | symbol)[];
}
type OmitDynamicKey<K extends PropertyKey> = {} extends Record<K, unknown> ? never : K;
type OptionalizeKey<T, K extends (string | symbol)[] | undefined> = K extends PropertyKey[] ? Omit<T, K[number]> & Partial<Omit<T, keyof Omit<T, K[number]>>> : T;
type StructGuardedCriteria<T extends StructSetableCriteria> = {
    -readonly [K in keyof OptionalizeKey<T['struct'], T['optional']> as OmitDynamicKey<K>]: T['struct'][K] extends SetableCriteria ? GuardedCriteria<T['struct'][K]> : T['struct'][K] extends SetableStruct ? GuardedCriteria<SimulateStruct<T['struct'][K]>> : never;
};
export interface StructGenericTypes<T extends StructSetableCriteria> extends GenericTypesTemplate<StructMountedCriteria<T>, StructGuardedCriteria<T>> {
}
export {};
