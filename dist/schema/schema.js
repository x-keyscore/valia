"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const managers_1 = require("./managers");
const services_1 = require("./services");
const formats_1 = require("./formats");
const utils_1 = require("../utils");
/**
 * Represents a schema for data validation, including the validation criteria structure.
 */
class Schema {
    initiate(definedCriteria) {
        this.managers.formats.set(formats_1.formatNatives);
        const clonedCriteria = (0, services_1.cloner)(definedCriteria);
        this.mountedCriteria = (0, services_1.mounter)(this.managers, clonedCriteria);
    }
    constructor(criteria) {
        this.managers = {
            formats: new managers_1.FormatsManager(),
            events: new managers_1.EventsManager()
        };
        // Deferred initiation of criteria if not called directly,
        // as plugins (or custom extensions) may set up specific
        // rules and actions for the preparation of the criteria.
        if (new.target === Schema) {
            this.initiate(criteria);
        }
    }
    /**
     * Properties representing the root of the mounted criteria,
     * which can be used in other schemas.
     */
    get criteria() {
        if (!this.mountedCriteria) {
            throw new utils_1.Issue("Schema", "Criteria are not initialized.");
        }
        return (this.mountedCriteria);
    }
    /**
     * Validates the provided data against the schema.
     *
     * @param data - The data to be validated.
     *
     * @returns `true` if the value is **valid**, otherwise `false`.
     * This function acts as a **type guard**, ensuring that
     * the validated data conforms to `GuardedCriteria<T>`.
     */
    validate(data) {
        const reject = (0, services_1.checker)(this.managers, this.criteria, data);
        return (!reject);
    }
    /**
     * Evaluates the provided data against the schema.
     *
     * @param data - The data to be evaluated.
     *
     * @returns An object containing:
     * - `{ reject: SchemaReject, value: null }` if the data is **invalid**.
     * - `{ reject: null, value: GuardedCriteria<T> }` if the data is **valid**.
     */
    evaluate(data) {
        const reject = (0, services_1.checker)(this.managers, this.criteria, data);
        if (reject)
            return ({ reject, data: null });
        return ({ reject: null, data: data });
    }
}
exports.Schema = Schema;
/*
const schema = new Schema({
    type: "struct",
    label: "root",
    struct: {
        branch_1: {
            type: "struct",
            label: "branch_1",
            struct: {
                element: {
                    type: "struct",
                    label: "struct_b1",
                    struct: {
                        element: {
                            type: "struct",
                            label: "struct_b1",
                            struct: {
                                element: {
                                    type: "string",
                                    label: "string_b1"
                                }
                            }
                        }
                    }
                }
            }
        },
        branch_2: {
            type: "struct",
            label: "branch_2",
            struct: {
                element: {
                    type: "struct",
                    label: "struct_b2",
                    struct: {
                        element: {
                            type: "struct",
                            label: "struct_b2",
                            struct: {
                                element: {
                                    type: "string",
                                    label: "string_b2"
                                }
                            }
                        }
                    }
                }
            }
        },
        branch_3: {
            type: "struct",
            label: "branch_3",
            struct: {
                element: {
                    type: "struct",
                    label: "struct_b3",
                    struct: {
                        element: {
                            type: "struct",
                            label: "struct_b3",
                            struct: {
                                element: {
                                    type: "string",
                                    label: "string_b3"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

schema.validate({
    branch_1: {
        element: {
            element: {
                element: "string_b1"
            }
        }
    },
    branch_2: {
        element: {
            element: {
                element: "string_b2"
            }
        }
    },
    branch_3: {
        element: {
            element: {
                element: "string_b3"
            }
        }
    },
})*/ 
