import type { NodePath, CheckerRejection } from "../services";
import type { MountedCriteria } from "../formats";
import { SchemaDataRejection } from "../utils";

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
        rootNode: MountedCriteria,
        rootData: unknown,
        rejection: SchemaDataRejection
    ) => void;
    DATA_ACCEPTED: (
        rootNode: MountedCriteria,
        rootData: unknown
    ) => void;
}