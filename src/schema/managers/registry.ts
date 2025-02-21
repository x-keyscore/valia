import type { RegistryKey, RegistryValue } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
import { metadataSymbol } from "../services";
import { Issue } from "../../utils";

export function registryManager(this: SchemaInstance) {
	return ({
		registry: new Map<RegistryKey, RegistryValue>(),
		/**
		 * Add the criteria node in the registry.
		 * 
		 * @param prevCriteria Previous criteria of `currCriteria` node.
		 * @param currCriteria Current criteria added to the registry.
		 * @param pathSegments Path segments of the `currCriteria` node.
		 */
		set(
			prevCriteria: RegistryKey | null,
			currCriteria: RegistryKey,
			pathSegments: RegistryValue['pathSegments']
		) {
			if (prevCriteria !== null) {
				if (!this.registry.has(prevCriteria)) throw new Issue(
					"Registry",
					"The reference of 'prevCriteria' is not present in the current registry."
				);
				this.registry.get(prevCriteria)!.nextCriteria.add(currCriteria);
			}

			if (this.registry.has(currCriteria)) {
				throw new Issue(
					"Registry",
					"The reference of 'currCriteria' is already present in the current registry."
				);
			}

			this.registry.set(currCriteria, {
				nextCriteria: new Set(),
				pathSegments
			});
		},
		/**
		 * Junction of criteria mounted to unmounted.
		 * 
		 * @param targetCriteria Target criteria of the junction.
		 */
		junction(targetCriteria: MountedCriteria) {
			const sourceCriteria = targetCriteria[metadataSymbol].registryKey;
			const sourceRegistry = targetCriteria[metadataSymbol].registry;
			if (!sourceRegistry.has(sourceCriteria)) throw new Issue(
				"Registry",
				"The source node of the junction criteria is not present in its own registry."
			);

			const valueOfTarget = this.registry.get(targetCriteria)!;
			const valueOfSource = sourceRegistry.get(sourceCriteria)!;

			// SET TARGET
			this.registry.set(targetCriteria, {
				nextCriteria: valueOfSource.nextCriteria,
				pathSegments: valueOfTarget.pathSegments
			});

			// MERGE REGISTRY
			let queue: RegistryKey[] = [...valueOfSource.nextCriteria.keys()];
			while (queue.length > 0) {
				const referenceKey = queue.pop()!;
				const referenceValue = sourceRegistry.get(referenceKey)!;

				this.registry.set(referenceKey, referenceValue);

				queue.push(...referenceValue.nextCriteria.keys()!);
			}
		},
		getNextCriteria(criteria: RegistryKey) {
			if (!this.registry.has(criteria)) throw new Issue(
				"Registry",
				"The criteria reference is not present in the current registry."
			);

			return (this.registry.get(criteria)!.pathSegments);
		},
		/**
		 * Composition of explicit path :
		 * ```py
		 * segment = (string / number / symbol)
		 * path    = [*(...segment)]
		 * ```
		 * 
		 * Exemple :
		 *  ```py
		 * my-path = ["struct", "products", "item", "price"]
		 * ```
		 * 
		 * Composition of implicit path :
		 * ```py
		 * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
		 * static-key    = ["&", (string / number / symbol)]
		 * segment       = dynamic-key / static-key
		 * path          = [1*(...segment)]
		 * ```
		 * 
		 * Exemple :
		 * ```py
		 * my-path = ["&", "products", "%", "number", "&", "price"]
		 * my-path is products[0].price or products[1].price and continue
		 * ```
		 */
		getPathSegments(criteria: RegistryKey) {
			if (!this.registry.has(criteria)) throw new Issue(
				"Registry",
				"The criteria reference is not present in the current registry."
			);

			return (this.registry.get(criteria)!.pathSegments);
		}
	});
}