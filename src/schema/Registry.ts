import type { MountedCriteria, VariantCriteria } from "./formats";
import { LibraryError } from "../utils";

type StorageKey = MountedCriteria<VariantCriteria>;

interface StorageValue {
	prev: StorageKey | null;
	data: {
		pathParts: string[];
		link?: string
	};
}

export const registrySymbol = Symbol('registry');

export class Registry {
	public storage: Map<StorageKey, StorageValue> = new Map();

	/**
	 * Add a new criteria node to the registry.
	 */
	add(prevCriteria: StorageKey | null, currCriteria: StorageKey, data: StorageValue['data']) {
		this.storage.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	/**
	 * Merging an unmounted criteria node with a mounted criteria node.
	 */
	merge(prevCriteria: StorageKey, currCriteria: StorageKey, data: StorageValue['data']) {
		const sourceRegisterStorage = currCriteria[registrySymbol].storage;

		this.storage = new Map([...this.storage, ...sourceRegisterStorage]);

		this.storage.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	/**
	 * @param criteria Reference of the criteria node for which you want to retrieve the path.
	 * @param separator Character that separates the different parts of the path.
	 * @returns The path
	 */
	getPath(criteria: StorageKey, separator: string) {
		let prev = this.storage.get(criteria);
		if (!prev) throw new LibraryError(
			"Registry getPath",
			"The criteria reference was not found in the register"
		);

		let fullPath = prev.data.pathParts.join(separator);
		while (prev.prev) {
			prev = this.storage.get(prev.prev);
			if (!prev) break;
			fullPath = prev.data.pathParts.join(separator) + separator + fullPath;
		}

		return (fullPath);
	}
}

export type RegistryInstance = InstanceType<typeof Registry>;