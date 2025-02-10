export declare class Err extends Error {
    print(context: string, plugin?: string): void;
    constructor(context: string, message: string, plugin?: string);
}
