import type { SetableCriteria, MountedCriteria } from "./formats";
import type { NodePath } from "./services";

export class SchemaException extends Error {
    name = "SchemaException";

	constructor(message: string) {
        super(message);
	}
}

export class SchemaNodeException extends Error {
    name = "SchemaNodeException";
    /**
     * Code related to the exception.
     */
    public code: string;
    /**
     * Node related to the exception.
     */
    public node: SetableCriteria;
    /**
     * Path of the node related to the rejection.
     */
    public nodePath: NodePath;

	constructor(
        code: string,
        message: string,
        node: SetableCriteria,
        nodePath: NodePath
    ) {
        super(message);

        this.code = code;
        this.node = node;
        this.nodePath = nodePath;
	}
}

export class SchemaDataRejection {
    /**
     * Root of the data to be validated.
     */
    public rootData: unknown;
    /**
     * Root node used for validation.
     */
    public rootNode: MountedCriteria;
    /**
     * Label of the root node used for validation.
     */
    public rootLabel: string | undefined;
    /**
     * Code related to the rejection.
     */
    public code: string;
     /**
     * Data rejected.
     */
    public data: unknown;
    /**
     * Node related to the rejection.
     */
    public node: MountedCriteria;
    /**
     * Path of the node related to the rejection.
     */
    public nodePath: NodePath;
    /**
     * Label of the  node related to the rejection.
     */
    public label: string | undefined;
    /**
     * Message of the node related to the rejection.
     */
    public message: string | undefined;
    
    

	constructor(
        rootData: unknown,
        rootNode: MountedCriteria,
        code: string,
        data: unknown,
        node: MountedCriteria,
        nodePath: NodePath,
    ) {
        this.rootData = rootData;
        this.rootNode = rootNode;
        this.rootLabel = rootNode.label;
        this.code = code;
        this.data = data;
        this.node = node;
        this.nodePath = nodePath;
        this.label = node.label;

        if (typeof node.message === "function") {
            this.message = node.message(
                code, data, node, nodePath
            );
        } else {
            this.message = node.message;
        }
	}
}

export class SchemaDataAdmission<GuardedData = unknown> {
    /**
     * Root of the validated data.
     */
    public data: GuardedData;
    /**
     * Root node used for validation.
     */
    public node: MountedCriteria;
    /**
     * Label of the root node used for validation.
     */
    public label: string | undefined;

	constructor(
        data: GuardedData,
        node: MountedCriteria
    ) {
        this.data = data;
        this.node = node;
        this.label = node.label;
	}
}