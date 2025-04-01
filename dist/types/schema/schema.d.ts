import type { SetableCriteria, MountedCriteria, GuardedCriteria, FormatNatives } from "./formats";
import { EventsManager, FormatsManager } from "./managers";
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
export declare class Schema<const T extends SetableCriteria = SetableCriteria<keyof FormatNatives>> {
    private _criteria;
    protected managers: {
        formats: FormatsManager;
        events: EventsManager;
    };
    protected initiate(definedCriteria: T): void;
    constructor(criteria: T);
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria(): MountedCriteria<T>;
    /**
     * Validates the provided data against the schema.
     *
     * @param data - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(data: unknown): data is GuardedCriteria<T>;
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(data: unknown): {
        reject: import("./services").CheckingReject;
        data: null;
    } | {
        reject: null;
        data: GuardedCriteria<T>;
    };
}
