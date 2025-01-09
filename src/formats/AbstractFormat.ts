import { SchemaMountTask, SchemaCheckTask } from "../schema/types";
import type {
	FormatsCriteria,
	MountedCriteria,
	PredefinedCriteria,
	FormatCheckEntry,
} from "./types";

export const isMountedSymbol = Symbol('isMounted');

export function isAlreadyMounted(criteria: object): criteria is MountedCriteria<FormatsCriteria> {
	if (criteria.hasOwnProperty(isMountedSymbol)) return (true);
	return (false);
}

export const globalCriteria = {
	require: true
}

export abstract class AbstractFormat<Criteria extends FormatsCriteria> {
	public abstract readonly type: Criteria['type'];
	protected readonly baseMountedCriteria: typeof globalCriteria & PredefinedCriteria<Criteria>;

	constructor(predefinedCriteria: PredefinedCriteria<Criteria>) {
		const newObj = {};
		Object.defineProperty(newObj, isMountedSymbol, {
			value: true,
			writable: false,
			enumerable: false,
			configurable: false
		});
		this.baseMountedCriteria = Object.assign(newObj, globalCriteria, predefinedCriteria);
	}

	abstract mountCriteria(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): MountedCriteria<Criteria>;

	abstract getMountingTasks(
		definedCriteria: Criteria,
		mountedCriteria: MountedCriteria<Criteria>
	): SchemaMountTask[];

	abstract checkEntry(
		criteria: MountedCriteria<Criteria>,
		entry: unknown
	): FormatCheckEntry;

	abstract getCheckingTasks(
		criteria: MountedCriteria<Criteria>,
		entry: any
	): SchemaCheckTask[];
}