import type { SetableCriteria } from "./formats";
import type { SchemaType } from "./types";
import { Schema } from "./schema";
export declare abstract class AbstractPlugin<const T extends SetableCriteria> extends Schema<T> {
    /**
     * This method is required because if the user mixes multiple plugins, the constructors cannot be used.
     *
     * Therefore, this method will be called when the main class is instantiated.
     */
    protected abstract init(...args: ConstructorParameters<SchemaType<T>>): void;
    constructor(...args: ConstructorParameters<SchemaType<T>>);
}
export declare function SchemaPlugins<T, U, V, W, X, Y>(plugin_1: new (...args: T[]) => U, plugin_2?: new (...args: V[]) => W, plugin_3?: new (...args: X[]) => Y): new (...args: T[] & V[] & X[]) => U & W & Y;
