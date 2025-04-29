import type { Events } from "./types";

export class EventsManager {
	listeners = new Map<keyof Events, ((...args: any[]) => any)[]>();

	constructor() {}

	on<K extends keyof Events>(event: K, callback: Events[K]) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event)!.push(callback);
	}

	emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
		const callbacks = this.listeners.get(event);
		if (!callbacks) return;

		for (const callback of callbacks) {
			callback(...args);
		}
	}

	off<K extends keyof Events>(event: K, callback: Events[K]) {
		const listeners = this.listeners.get(event);
		if (!listeners) return;

		const index = listeners.indexOf(callback);
		if (index !== -1) listeners.splice(index, 1);
	}
}



