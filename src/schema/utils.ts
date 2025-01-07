export function construct<T extends new (...args: any[]) => any>(
	target: T,
	args: ConstructorParameters<T>
): InstanceType<T> {
	return Reflect.construct(target, args);
}

export function constructs<T extends Record<string, new (...args: any[]) => any>>(
	constructors: T,
	args: any[]
) {
	return Object.fromEntries(
		Object.entries(constructors).map(([key, constructor]) => [key, construct(constructor, args)])
	) as { [K in keyof T]: InstanceType<T[K]> };
}

export function profiler() {
	return {
		startTime: performance.now(),
		end(decimal?: number) {
			if (decimal) return (performance.now() - this.startTime).toFixed(decimal);
			return (performance.now() - this.startTime);
		}
	}
}