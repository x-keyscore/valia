import type { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate } from "../types";
export interface NumberTunalbleCriteria extends TunableCriteriaTemplate<"number"> {
    min?: number;
    max?: number;
    enum?: number[] | Record<string | number, number>;
    custom?: (input: number) => boolean;
}
export interface NumberConcreteTypes extends ConcreteTypesTemplate<NumberTunalbleCriteria, {}> {
}
type NumberGuardedCriteria<T extends NumberTunalbleCriteria> = T['enum'] extends number[] ? T['enum'][number] : T['enum'] extends Record<string | number, number> ? {
    [K in keyof T['enum']]: T['enum'][K];
}[keyof T['enum']] : number;
export interface NumberGenericTypes<T extends NumberTunalbleCriteria> extends GenericTypesTemplate<NumberTunalbleCriteria, {}, NumberGuardedCriteria<T>> {
}
export {};
