import type { NodePaths, CheckerReject } from "../services";
import type { MountedCriteria } from "../formats";

// EVENTS

export interface Events {
    "NODE_MOUNTED": (
        node: MountedCriteria,
        path: NodePaths
    ) => void;
    "TREE_MOUNTED": (
        rootNode: MountedCriteria
    ) => void;
    "DATA_CHECKED": (
        rootNode: MountedCriteria,
        rootData: unknown,
        reject: CheckerReject | null
    ) => void;
}