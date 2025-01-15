import type { VariantCriteria, MountedCriteria, DefaultCriteria, CheckValueResult, DefaulGlobalCriteria } from "./types";
export declare const isMountedSymbol: unique symbol;
export declare function isAlreadyMounted(criteria: VariantCriteria | MountedCriteria<VariantCriteria>): criteria is MountedCriteria<VariantCriteria>;
export declare abstract class AbstractFormat<Criteria extends VariantCriteria> {
    protected readonly baseMountedCriteria: DefaulGlobalCriteria & DefaultCriteria<Criteria>;
    constructor(defaultCriteria: DefaultCriteria<Criteria>);
    abstract mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    abstract checkValue(criteria: MountedCriteria<Criteria>, value: unknown): CheckValueResult;
}
