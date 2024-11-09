import type { FormatCheckerResult, FormatsCriteria, PredefinedCriteria } from "./types";

const defaultCriteria = {
	require: true
}

export abstract class AbstractFormat<DefinedCriteria extends FormatsCriteria> {
	protected abstract readonly predefinedCriteria: PredefinedCriteria<DefinedCriteria>;
	protected readonly definedCriteria: DefinedCriteria;

	constructor(definedCriteria: DefinedCriteria) {
		this.definedCriteria = definedCriteria;
	}

	get criteria() {
		return { ...defaultCriteria, ...this.predefinedCriteria, ...this.definedCriteria };
	}

	abstract checker(src: unknown): FormatCheckerResult;

	/*
	public check(input: FormatInput<DefinedCriteria>) {
		return this.checker(input)
	}*/
}