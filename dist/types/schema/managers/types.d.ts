import type { MountedCriteria, SetableCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";
import type { Rejection } from "../services";
import { registryManager } from "./registry";
import { formatsManager } from "./formats";
import { eventsManager } from "./events";
type ExplicitPathArray = (string | number | symbol)[];
type ImplicitPathSyntax = (LooseAutocomplete<"&" | "%" | "@" | "string" | "number" | "symbol"> | number | symbol);
type ImplicitPathArray = ImplicitPathSyntax[];
export type RegistryKey = SetableCriteria | MountedCriteria;
export interface RegistryValue {
    nextNodes: Set<RegistryKey>;
    partPaths: {
        explicit: ExplicitPathArray;
        implicit: ImplicitPathArray;
    };
}
export type RegistryManager = ReturnType<typeof registryManager>;
export type FormatsManager = ReturnType<typeof formatsManager>;
export interface Events {
    "ONE_NODE_MOUNTED": (criteria: MountedCriteria, path: RegistryValue['partPaths']) => void;
    "END_OF_MOUNTING": (criteria: MountedCriteria) => void;
    "ONE_NODE_CHECKED": (criteria: MountedCriteria, path: RegistryValue['partPaths']) => void;
    "END_OF_CHECKING": (criteria: MountedCriteria, reject: Rejection | null) => void;
}
export type EventsManager = ReturnType<typeof eventsManager>;
export {};
