import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";
export type OmegaTypes = "undefined" | "unknown" | "nullish" | "null" | "any";
export interface OmegaSetableCriteria extends SetableCriteriaTemplate<"omega"> {
    omega: OmegaTypes;
}
export interface OmegaClassicTypes extends ClassicTypesTemplate<OmegaSetableCriteria, {}> {
}
export interface OmegaMountedCriteria {
    bitcode: number;
}
type OmegaGuardedCriteria<T extends OmegaSetableCriteria> = T["omega"] extends "undefined" ? undefined : T["omega"] extends "unknown" ? unknown : T["omega"] extends "nullish" ? null | undefined : T["omega"] extends "null" ? null : T["omega"] extends "any" ? any : never;
export interface OmegaGenericTypes<T extends OmegaSetableCriteria> extends GenericTypesTemplate<OmegaMountedCriteria, OmegaGuardedCriteria<T>> {
}
export {};
