import type { PathSegments, CheckerReject } from "../services";
import type { MountedCriteria } from "../formats";
import { FormatsManager } from "./formats";
import { EventsManager } from "./events";
export type FormatsManagerInstance = InstanceType<typeof FormatsManager>;
export interface Events {
    "ONE_NODE_MOUNTED": (node: MountedCriteria, path: PathSegments) => void;
    "END_OF_MOUNTING": (node: MountedCriteria) => void;
    "ONE_NODE_CHECKED": (node: MountedCriteria, path: PathSegments) => void;
    "END_OF_CHECKING": (node: MountedCriteria, reject: CheckerReject | null) => void;
}
export type EventsManagerInstance = InstanceType<typeof EventsManager>;
