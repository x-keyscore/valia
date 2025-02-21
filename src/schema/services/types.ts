import type { SetableCriteria, MountedCriteria } from "../formats";
import { RegistryPathSegments } from "../managers";

export interface MountingTask {
	prevCriteria: SetableCriteria | MountedCriteria | null;
	prevPath: RegistryPathSegments;
	criteria: SetableCriteria | MountedCriteria;
	pathSegments: RegistryPathSegments;
}

/**
 * @template U Custom members you want to add to the object.
 */
export type CheckingTaskHooks<U extends Record<string, any> = { [key: string]: any; }> = {
	/**
	 * Criteria responsible for managing the hooks. 
	 * This information will be included in the rejection reasons 
	 * if a hook returns a rejection code.
	 */
	owner: {
		criteria: MountedCriteria;
		path: RegistryPathSegments;
	}
	/**
	 * Hook executed just before the verification process.
	 * - Returns `true`: Proceeds with the verification.
	 * - Returns `false`: Cancels the verification.
	 * - Returns a rejection code: Terminates the entire verification process.
	 */
	beforeCheck(criteria: MountedCriteria): boolean | string;
	/**
	 * Hook executed immediately after the verification process.
	 * - Returns `true`: Proceed to the other verification.
	 * - Returns `false`: Bypasses the rejection.
	 * - Returns a rejection code: Terminates the entire verification process.
	 */
	afterCheck(criteria: MountedCriteria, reject: string | null): boolean | string;
} & U;

export type CheckingTask = {
	prevPath: RegistryPathSegments;
	criteria: MountedCriteria<SetableCriteria>;
	value: unknown;
	hooks?: CheckingTaskHooks;
}

export interface CheckerReject {
	path: RegistryPathSegments;
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
	label: string | undefined;
	message: string | undefined;
}