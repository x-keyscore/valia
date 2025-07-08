import { FormatTypes, SetableCriteria } from "./formats";
import { NodePaths } from "./services";

interface SchemaNodeErrorContext {
    node: SetableCriteria;
    type: FormatTypes;
    path: NodePaths;
    code: string;
    message: string;
}

export class SchemaNodeError extends Error {
    public node: SetableCriteria;
    public type: FormatTypes;
    public path: NodePaths;
    public code: string;
    public message: string;

	constructor(context: SchemaNodeErrorContext) {
		super(context.message);

        this.node = context.node;
        this.type = context.type;
        this.path = context.path;
        this.code = context.code;
        this.message = context.message;
	}
}

interface SchemaDataRejectContext {
    node: SetableCriteria;
    type: FormatTypes;
    path: NodePaths;
    code: string;
    message: string;
}

export class SchemaDataReject {
    public node: SetableCriteria;
    public type: FormatTypes;
    public path: NodePaths;
    public code: string;
    public message: string;

	constructor(context: SchemaDataRejectContext) {
        this.node = context.node;
        this.type = context.type;
        this.path = context.path;
        this.code = context.code;
        this.message = context.message;
	}
}