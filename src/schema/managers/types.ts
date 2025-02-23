import type { MountedCriteria, SetableCriteria } from "../formats";
import type { LooseAutocomplete } from "../../types";
import type { Reject } from "../services";
import { registryManager } from "./registry";
import { eventsManager } from "./events";

// REGISTRY

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

export type RegistryManager = typeof registryManager;

// EVENTS

export interface Events {
    "NODE_MOUNTED": (
        criteria: MountedCriteria,
        path: RegistryValue['partPaths']
    ) => void;
    "FULL_MOUNTED": () => void;
    "NODE_CHECKED": (
        criteria: MountedCriteria,
        path: RegistryValue['partPaths'],
        reject: Reject | null
    ) => void;
}

export type EventsManager = typeof eventsManager;