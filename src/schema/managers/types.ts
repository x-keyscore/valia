import type { PathSegments, CheckerReject } from "../services";
import type { MountedCriteria } from "../formats";

// EVENTS

export interface Events {
    "NODE_MOUNTED": (
        node: MountedCriteria,
        path: PathSegments
    ) => void;
    "TREE_MOUNTED": (
        node: MountedCriteria
    ) => void;
    "TREE_CHECKED": (
        node: MountedCriteria,
        reject: CheckerReject | null
    ) => void;
}