import { SchemaMountTask, SchemaCheckTask } from "../schema/types";
import type {
	FormatsCriteria,
	MountedCriteria,
	PredefinedCriteria,
	FormatCheckValueResult,
} from "./types";

export const isMountedSymbol = Symbol('isMounted');

export function isAlreadyMounted(criteria: object): criteria is MountedCriteria<FormatsCriteria> {
	if (criteria.hasOwnProperty(isMountedSymbol)) return (true);
	return (false);
}

export const defaultCriteria = {
	require: true
}

export abstract class AbstractFormat<Criteria extends FormatsCriteria> {
	protected readonly baseMountedCriteria: typeof defaultCriteria & PredefinedCriteria<Criteria>;

	constructor(predefinedCriteria: PredefinedCriteria<Criteria>) {
		const obj = {};
		Object.defineProperty(obj, isMountedSymbol, {
			value: true,
			writable: false,
			enumerable: false,
			configurable: false
		});
		this.baseMountedCriteria = Object.assign(obj, defaultCriteria, predefinedCriteria);
	}

	abstract mountCriteria(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): MountedCriteria<Criteria>;

	abstract getMountingTasks(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): SchemaMountTask[];

	abstract checkValue(
		mountedCriteria: MountedCriteria<Criteria>,
		value: unknown
	): FormatCheckValueResult;

	abstract getCheckingTasks(
		mountedCriteria: MountedCriteria<Criteria>,
		value: any
	): SchemaCheckTask[];
}