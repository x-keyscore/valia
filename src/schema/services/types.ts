import type { TunableCriteria, MountedCriteria } from "../formats";
import { Mapper } from "../handlers";

export interface MountingTask {
	definedCriteria: TunableCriteria;
	mountedCriteria: MountedCriteria<TunableCriteria>;
}

interface CheckingTaskLink {
	finished: boolean;
	totalLinks: number;
	totalRejected: number;
}

export interface CheckingTask {
	criteria: MountedCriteria<TunableCriteria>;
	value: unknown;
	link?: CheckingTaskLink;
}

export interface CheckerReject {
	/**
	 * Error code structured as `<CATEGORY>_<DETAIL>`, where `<CATEGORY>` can be:
	 * 
	 * - `TYPE`: Indicates an error related to a data type (e.g., `TYPE_NOT_STRING`).
	 * - `VALUE`: Indicates an error related to the provided value (e.g., `VALUE_MISSING_KEY`).
	 * - `TEST`: Indicates an error related to a specific test or validation (e.g., `TEST_REGEX_FAILED`).
	 * 
	 * `<DETAIL>`: A specific description of the error, such as `NOT_STRING`, `MISSING_KEY`, etc.
	 */
	code: string;
	type: string;
	path: string;
	label: string | undefined;
	message: string | undefined;
}