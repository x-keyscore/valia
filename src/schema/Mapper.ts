import type { MountedCriteria, VariantCriteria } from "./formats";
import { Err } from "../utils";

type ReferenceKey = MountedCriteria<VariantCriteria>;

interface ReferenceValue {
	prev: ReferenceKey | null;
	data: {
		pathParts: string[];
	};
}

export const mapperSymbol = Symbol('mapper');

export class Mapper {
	public references: Map<ReferenceKey, ReferenceValue> = new Map();

	constructor (rootCriteria: ReferenceKey, data: ReferenceValue['data']) {
		this.references.set(rootCriteria, {
			prev: null,
			data
		});
	}

	/**
	 * Add a new criteria node to the mapper.
	 */
	add(prevCriteria: ReferenceKey | null, currCriteria: ReferenceKey, data: ReferenceValue['data']) {
		this.references.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	/**
	 * Merging an unmounted criteria node with a mounted criteria node.
	 */
	merge(prevCriteria: ReferenceKey, currCriteria: ReferenceKey, data: ReferenceValue['data']) {
		const sourceReferences = currCriteria[mapperSymbol].references;

		this.references = new Map([...this.references, ...sourceReferences]);

		this.references.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	/**
	 * @param criteria Reference of the criteria node for which you want to retrieve the path.
	 * @param separator Character that separates the different parts of the path.
	 * @returns The path
	 */
	getPath(criteria: ReferenceKey, separator: string) {
		let prev = this.references.get(criteria);
		if (!prev) throw new Err(
			"Registry",
			"The criteria reference was not found in the mapper."
		);

		let fullPath = prev.data.pathParts.join(separator);
		while (prev.prev) {
			prev = this.references.get(prev.prev);
			if (!prev) break;
			fullPath = prev.data.pathParts.join(separator) + separator + fullPath;
		}

		return (fullPath);
	}
}

export type MapperInstance = InstanceType<typeof Mapper>;