import { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, VariantCriteria } from "../types";
import { testers } from "../../..";
type ExtractParams<T extends (input: any, params: any) => any> = T extends (input: any, params: infer U) => any ? U : never;
type FunctionsTesters = typeof testers.string;
type Testers = {
    [K in keyof FunctionsTesters]: {
        name: K;
        params?: ExtractParams<FunctionsTesters[K]>;
    };
}[keyof FunctionsTesters];
export interface StringVariantCriteria extends VariantCriteriaTemplate<"string"> {
    min?: number;
    max?: number;
    /** @default true */
    empty?: boolean;
    enum?: string[] | Record<string, string>;
    regex?: RegExp;
    tester?: Testers;
    custom?: (value: string) => boolean;
}
export interface StringDefaultCriteria {
    empty: boolean;
}
export interface StringConcreteTypes extends ConcreteTypesTemplate<StringVariantCriteria, StringDefaultCriteria, {}> {
}
type StringGuard<T extends VariantCriteria> = T extends StringVariantCriteria ? T['enum'] extends string[] ? T['empty'] extends true ? T['enum'][number] | "" : T['enum'][number] : T['enum'] extends Record<string, string> ? T['empty'] extends true ? {
    [K in keyof T['enum']]: T['enum'][K];
}[keyof T['enum']] | "" : {
    [K in keyof T['enum']]: T['enum'][K];
}[keyof T['enum']] : string : never;
export interface StringGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<StringVariantCriteria, StringGuard<T>> {
}
export {};
