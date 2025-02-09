import type { TunableCriteria, MountedCriteria, GuardedCriteria } from "./formats";
import type { SchemaReject } from "./types";
import { Mapper } from "./handlers";
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export declare class Schema<const T extends TunableCriteria> {
    protected mapper: Mapper;
    /**
     * Property representing the mounted validation criteria.
     *
     * **Warning:** This property does not reflect the original criteria passed
     * during instantiation. It is the version that has been processed and mounted.
     */
    readonly criteria: MountedCriteria<T>;
    /**
     * Initializes a new schema with the provided validation criteria.
     *
     * @param criteria - The definition of validation criteria.
     * Once the class is instantiated, modifying these criteria will have no effect.
     */
    constructor(criteria: T);
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     * @param onReject - (Optional) A callback function triggered if validation fails.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that the validated data conforms
     * to `GuardedCriteria<T>`. See the example below for usage.
     */
    validate(value: unknown): value is GuardedCriteria<T>;
    /**
     * Validates the provided data against the schema.
     *
     * @param value - The data to be validated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(value: unknown): {
        reject: SchemaReject;
        value: null;
    } | {
        reject: null;
        value: GuardedCriteria<T>;
    };
}
