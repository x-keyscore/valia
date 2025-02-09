import type { CheckerReject } from "./types";
import type { TunableCriteria, MountedCriteria } from "../formats";
export declare function checker(criteria: MountedCriteria<TunableCriteria>, value: unknown): CheckerReject | null;
