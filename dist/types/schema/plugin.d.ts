import type { SetableCriteria } from "./formats";
import type { SchemaType } from "./types";
import { Schema } from "./schema";
export declare abstract class AbstractPlugin<const T extends SetableCriteria> extends Schema<T> {
    /**
     * This method is automatically called before the schema initialization.
     *
     * This allows, for example, to subscribe to events that will occur
     * during the initialization.
     */
    protected abstract beforeInitate(): void;
    /**
     * This method is automatically called after the schema initialization.
     */
    protected abstract afterInitate(): void;
    constructor(...args: ConstructorParameters<SchemaType<T>>);
}
export declare function SchemaPlugins<T, U, V, W, X, Y>(plugin_1: new (...args: T[]) => U, plugin_2?: new (...args: V[]) => W, plugin_3?: new (...args: X[]) => Y): new (...args: T[] & V[] & X[]) => U & W & Y;
