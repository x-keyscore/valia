export { Schema, SchemaCheck, SchemaGuard } from './schema';
export { stringToUTF16UnitArray } from './tools';
export * from './testers';
import { Schema } from "./schema";
export declare const testSchema: Schema<{
    readonly type: "record";
    readonly key: {
        readonly type: "string";
    };
    readonly value: {
        readonly type: "union";
        readonly union: [{
            readonly type: "string";
        }, {
            readonly type: "number";
        }];
    };
}>;
