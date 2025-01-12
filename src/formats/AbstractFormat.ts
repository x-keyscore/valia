import type { FormatsCriteria, MountedCriteria, DefaultCriteria, CheckValueResult } from "./types";
import { SchemaMountingTask, SchemaCheckingTask } from "../schema/types";

export const isMountedSymbol = Symbol('isMounted');

export function isAlreadyMounted(
	criteria: FormatsCriteria | MountedCriteria<FormatsCriteria>
): criteria is MountedCriteria<FormatsCriteria> {
	return (Object.prototype.hasOwnProperty(isMountedSymbol));
}

export const defaultGlobalCriteria = {
	require: true
}

export type DefaultGlobalCriteria = typeof defaultGlobalCriteria;

export abstract class AbstractFormat<Criteria extends FormatsCriteria> {
	protected readonly baseMountedCriteria: 
		& { [isMountedSymbol]: boolean }
		& DefaultGlobalCriteria
		& DefaultCriteria<Criteria>;

	constructor(defaultCriteria: DefaultCriteria<Criteria>) {
		this.baseMountedCriteria = Object.assign(
			{ [isMountedSymbol]: true },
			defaultGlobalCriteria,
			defaultCriteria
		);
	}

	abstract mountCriteria(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): MountedCriteria<Criteria>;

	abstract getMountingTasks(
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
}