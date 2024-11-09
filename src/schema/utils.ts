export function construct<T extends new (...args: any[]) => any>(
	target: T,
	args: any[]
): InstanceType<T> {
	return Reflect.construct(target, args);
}