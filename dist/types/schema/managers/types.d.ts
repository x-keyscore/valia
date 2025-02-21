import type { MountedCriteria, SetableCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";
import type { CheckerReject } from "../services";
import { registryManager } from "./registry";
import { eventsManager } from "./events";
type ExplicitPathArray = (string | number | symbol)[];
type ImplicitPathSyntax = (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol);
type ImplicitPathArray = ImplicitPathSyntax[];
export type RegistryKey = SetableCriteria | MountedCriteria;
export type RegistryNextCriteria = Set<RegistryKey>;
export interface RegistryPathSegments {
    explicit: ExplicitPathArray;
    implicit: ImplicitPathArray;
}
export interface RegistryValue {
    nextCriteria: Set<RegistryKey>;
    pathSegments: RegistryPathSegments;
}
export type RegistryManager = ReturnType<typeof registryManager>;
export interface Events {
    "CRITERIA_NODE_MOUNTED": (criteria: MountedCriteria, path: RegistryPathSegments) => void;
    "CRITERIA_NODE_CHECKED": (criteria: MountedCriteria, path: RegistryPathSegments, reject: CheckerReject) => void;
}
export type EventsManager = ReturnType<typeof eventsManager>;
export {};
