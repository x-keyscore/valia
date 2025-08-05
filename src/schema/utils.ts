import type { NodeExceptionReport, DataRejectionReport } from "./types";
import type { SetableCriteria } from "./formats";
import type { NodePath } from "./services";

export class SchemaNodeException extends Error {
    /**
     * Syntax: `<SOURCE><REASON>`
     *
     * Components:
     * - `<SOURCE>` : The source of the exception, such as `LABEL_PROPERTY`, `MIN_PROPERTY`, etc.
     * - `<REASON>` : The reason of the exception, such as `REQUIRED`, `MALFORMED` or `MISCONFIGURED`.
     */
    public code: string;
    public label: string | undefined;
    public message: string;
    public node: SetableCriteria;
    public nodePath: NodePath;

	constructor(report: NodeExceptionReport) {
        super();

        this.code = report.code;
        this.message = report.message;
        this.node = report.node;
        this.nodePath = report.nodePath;
	}
}

export class SchemaDataRejection {
    /**
     * Syntax: `<MEMBER>[<DETAIL>]<REASON>`
     *
     * Components:
     * - `<SOURCE>` : The source of the rejection, such as `TYPE`, `MIN`, `LITERAL` etc.
     * - `<REASON>` : The reason for the rejection: `UNALLOWED`, `UNSATISFIED`.
     */
    public code: string;
    public label: string | undefined;
    public message: string | undefined;
    public node: SetableCriteria;
    public nodePath: NodePath;

	constructor(report: DataRejectionReport) {
        this.code = report.code;
        this.label = report.node.label;
        this.message = report.node.message;
        this.node = report.node;
        this.nodePath = report.nodePath;
	}
}