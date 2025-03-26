import type { PathSegments, CheckingReject } from "../services";
import type { MountedCriteria } from "../formats";
export interface Events {
    "NODE_MOUNTED": (node: MountedCriteria, path: PathSegments) => void;
    "TREE_MOUNTED": (node: MountedCriteria) => void;
    "DATA_CHECKED": (node: MountedCriteria, reject: CheckingReject | null) => void;
}
