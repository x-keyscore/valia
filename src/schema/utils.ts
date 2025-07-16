import type { NodeExceptionReport, DataRejectionReport } from "./types";
import type { SetableCriteria } from "./formats";
import type { NodePath } from "./services";

export class SchemaNodeException extends Error {
    public code: string;
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
     * - `<MEMBER>`    : The criterion involved (e.g. EMPTY, MIN, ENUM)
     * - `<DETAIL>`    : Specific detail or sub-aspect of the criteria (e.g. LENGTH, PATTERN)
     * - `<REASON>`    : The reason for rejection (e.g. NOT_SATISFIED, NOT_ALLOWED)
     */
    public code: string;
    public node: SetableCriteria;
    public nodePath: NodePath;

	constructor(report: DataRejectionReport) {
        this.code = report.code;
        this.node = report.node;
        this.nodePath = report.nodePath;
	}
}