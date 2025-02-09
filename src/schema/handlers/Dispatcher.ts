interface Events {
	"mount": (data: string) => void;
	"check": (data: string, test: string) => void;
}

class Dispatcher {
	private listeners: { [K in keyof Events]?: ((...args: any[]) => any)[] } = {};

	on<K extends keyof Events>(event: K, callback: Events[K]) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event]!.push(callback);
	}

	emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
		const callbacks = this.listeners[event];
		if (!callbacks) return ;
		for (const callback of callbacks) {
			callback(...args);
		}
	}

	off<K extends keyof Events>(event: K, callback: Events[K]) {
		const listeners = this.listeners[event];
		if (!listeners) return;

		const index = listeners.indexOf(callback);
		if (index !== -1) {
			listeners.splice(index, 1);
		}
	}
}


const test = new Dispatcher()

test.emit("check", "sd", "er")

