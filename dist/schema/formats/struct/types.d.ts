import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria, GuardedCriteria, MountedCriteria } from "../types";
export type StructCriteria = {
    [key: string | symbol]: TunableCriteria | StructCriteria;
};
export interface StructTunableCriteria extends TunableCriteriaTemplate<"struct"> {
    optional?: (string | symbol)[];
    struct: StructCriteria;
}
export interface StructConcreteTypes extends ConcreteTypesTemplate<StructTunableCriteria, {}> {
}
type SimulateStruct<T> = StructTunableCriteria & {
    struct: T;
};
type StructMounted<T extends StructCriteria> = {
    [K in keyof T]: T[K] extends TunableCriteria ? MountedCriteria<T[K]> : T[K] extends StructCriteria ? MountedCriteria<SimulateStruct<T[K]>> : T[K] extends (TunableCriteria | StructCriteria) ? MountedCriteria<TunableCriteria> : T[K];
};
interface StructMountedCriteria<T extends StructTunableCriteria> {
    struct: StructMounted<T['struct']>;
    acceptedKeys: (string | symbol)[];
    requiredKeys: (string | symbol)[];
}
type OmitDynamicKey<K extends PropertyKey> = {} extends Record<K, unknown> ? never : K;
type OptionalizeKey<T, K extends (string | symbol)[] | undefined> = K extends PropertyKey[] ? Omit<T, K[number]> & Partial<Omit<T, keyof Omit<T, K[number]>>> : T;
type StructGuardedCriteria<T extends StructTunableCriteria> = {
    -readonly [K in keyof OptionalizeKey<T['struct'], T['optional']> as OmitDynamicKey<K>]: T['struct'][K] extends TunableCriteria ? GuardedCriteria<T['struct'][K]> : T['struct'][K] extends StructCriteria ? GuardedCriteria<SimulateStruct<T['struct'][K]>> : never;
};
export interface StructGenericTypes<T extends StructTunableCriteria> extends GenericTypesTemplate<StructTunableCriteria, StructMountedCriteria<T>, StructGuardedCriteria<T>> {
}
export {};
