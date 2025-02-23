import type { Events } from "./types";
export declare const eventsManager: {
    listeners: Map<keyof Events, ((...args: any[]) => any)[]>;
    on<K extends keyof Events>(event: K, callback: Events[K]): void;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
    off<K extends keyof Events>(event: K, callback: Events[K]): void;
};
