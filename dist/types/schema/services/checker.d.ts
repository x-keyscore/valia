import type { RegistryManager } from "../managers";
import type { SetableCriteria, MountedCriteria } from "../formats";
import type { CheckerReject } from "./types";
export declare function checker(registryManager: RegistryManager, criteria: MountedCriteria<SetableCriteria>, value: unknown): CheckerReject | null;
