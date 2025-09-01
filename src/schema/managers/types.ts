import type { MountedCriteria } from "../formats";
import type { NodePath } from "../services";
import { SchemaDataRejection, SchemaDataAdmission } from "../utils";

// EVENTS

export interface Events {
    NODE_MOUNTED: (
        node: MountedCriteria,
        nodePath: NodePath
    ) => void;
    TREE_MOUNTED: (
        rootNode: MountedCriteria
    ) => void;
    DATA_REJECTED: (
        rejection: SchemaDataRejection
    ) => void;
    DATA_ADMITTED: (
        admission: SchemaDataAdmission
    ) => void;
}