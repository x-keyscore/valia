import type { MountedCriteria, VariantCriteria } from "../formats";
import { metadataSymbol } from "./mounter";
import { LibraryError } from "../utils";

type RegisterKey = MountedCriteria<VariantCriteria>;

interface RegisterValue {
	prev: RegisterKey | null;
	data: {
		pathParts: string[];
		link?: string
	};
}

export class Register {
	public storage: Map<RegisterKey, RegisterValue> = new Map();

	add(prevCriteria: RegisterKey | null, currCriteria: RegisterKey, data: RegisterValue['data']) {
		this.storage.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	merge(prevCriteria: RegisterKey, currCriteria: RegisterKey, data: RegisterValue['data']) {
		const sourceRegisterStore = currCriteria[metadataSymbol].register.storage;

		// MERGE REGISTER STORAGE
		this.storage = new Map([...this.storage, ...sourceRegisterStore]);

		this.storage.set(currCriteria, {
			prev: prevCriteria,
			data
		});
	}

	getPath(criteria: RegisterKey, separator: string) {
		let prev = this.storage.get(criteria);
		if (!prev) throw new LibraryError(
			"Register getPath",
			"The criteria reference was not found in the registry"
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