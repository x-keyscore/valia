export declare function construct<T extends new (...args: any[]) => any>(target: T, args: ConstructorParameters<T>): InstanceType<T>;
export declare function constructs<T extends Record<string, new (...args: any[]) => any>>(constructors: T, args: any[]): { [K in keyof T]: InstanceType<T[K]>; };
export declare function profiler(): {
    startTime: number;
    end(decimal?: number): string | number;
};
