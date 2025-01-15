"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
export const isMountedSymbol = Symbol('isMounted');

export function isAlreadyMounted(
    criteria: VariantCriteria | MountedCriteria<VariantCriteria>
): criteria is MountedCriteria<VariantCriteria> {
    return (Object.prototype.hasOwnProperty(isMountedSymbol));
}

export abstract class AbstractFormat<Criteria extends VariantCriteria> {
    protected readonly baseMountedCriteria: DefaulGlobalCriteria & DefaultCriteria<Criteria>;

    constructor(defaultCriteria: DefaultCriteria<Criteria>) {
        this.baseMountedCriteria = Object.assign(
            {
                [isMountedSymbol]: true,
                optional: false,
                nullable: false
            },
            defaultCriteria
        );
    }

    abstract mountCriteria(
        definedCriteria: Criteria,
        mountedCriteria: MountedCriteria<Criteria>
    ): MountedCriteria<Criteria>;


    getMountingTasks(
        definedCriteria: Criteria,
        mountedCriteria: MountedCriteria<Criteria>
    ): SchemaMountingTask[];

    abstract checkValue(
        criteria: MountedCriteria<Criteria>,
        value: unknown
    ): CheckValueResult;

    abstract getCheckingTasks(
        criteria: MountedCriteria<Criteria>,
        value: any
    ): SchemaCheckingTask[];
}*/ 
