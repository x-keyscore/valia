import type { PathSegments, CheckingReject } from "../services";
import type { MountedCriteria } from "../formats";

// EVENTS

export interface Events {
    "NODE_MOUNTED": (
        node: MountedCriteria,
        path: PathSegments
    ) => void;
    "TREE_MOUNTED": (
        rootNode: MountedCriteria
    ) => void;
    "DATA_CHECKED": (
        rootNode: MountedCriteria,
        rootData: unknown,
        reject: CheckingReject | null
    ) => void;
}