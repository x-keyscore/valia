import type { NodePath, CheckerRejection } from "../services";
import type { MountedCriteria } from "../formats";

// EVENTS

export interface Events {
    "NODE_MOUNTED": (
        node: MountedCriteria,
        path: NodePath
    ) => void;
    "TREE_MOUNTED": (
        rootNode: MountedCriteria
    ) => void;
    "DATA_CHECKED": (
        rootNode: MountedCriteria,
        rootData: unknown,
        rejection: CheckerRejection | null
    ) => void;
}