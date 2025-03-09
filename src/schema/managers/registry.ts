import type { RegistryKey, RegistryValue } from "./types";
import type { MountedCriteria } from "../formats";
import { metadataSymbol } from "../services";
import { Issue } from "../../utils";

export function registryManager() {
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
			prevNode: RegistryKey | null,
			currNode: RegistryKey,
			partPaths: RegistryValue['partPaths']
		) {
			if (prevNode !== null) {
				if (!this.registry.has(prevNode)) throw new Issue(
					"Registry",
					"The reference of 'prevNode' is not present in the current registry."
				);
				this.registry.get(prevNode)!.nextNodes.add(currNode);
			}
	
			if (this.registry.has(currNode)) {
				throw new Issue(
					"Registry",
					"The reference of 'currNode' is already present in the current registry."
				);
			}
	
			this.registry.set(currNode, {
				nextNodes: new Set(),
				partPaths
			});
		},
		junction(targetNode: MountedCriteria) {
			const sourceRegistry = targetNode[metadataSymbol].registry;
			const sourceNode = targetNode[metadataSymbol].saveNode;
			if (!sourceRegistry.has(sourceNode)) throw new Issue(
				"Registry",
				"The source node of the junction criteria is not present in its own registry."
			);
	
			const valueOfTarget = this.registry.get(targetNode)!;
			const valueOfSource = sourceRegistry.get(sourceNode)!;
	
			// SET TARGET
			this.registry.set(targetNode, {
				nextNodes: valueOfSource.nextNodes,
				partPaths: valueOfTarget.partPaths
			});
	
			// MERGE REGISTRY
			let queue: RegistryKey[] = [...valueOfSource.nextNodes.keys()];
			while (queue.length > 0) {
				const referenceKey = queue.pop()!;
				const referenceValue = sourceRegistry.get(referenceKey)!;
	
				this.registry.set(referenceKey, referenceValue);
	
				queue.push(...referenceValue.nextNodes.keys()!);
			}
		},
		getNextNodes(criteria: RegistryKey) {
			if (!this.registry.has(criteria)) throw new Issue(
				"Registry",
				"The criteria reference is not present in the current registry."
			);
	
			return (this.registry.get(criteria)!.nextNodes);
		},
		/**
		 * **Composition of explicit path :**
		 * ```py
		 * segment = (string / number / symbol)
		 * path    = [*(...segment)]
		 * ```
		 * 
		 * **Exemple :**
		 *  ```py
		 * my-path = ["struct", "products", "item", "price"]
		 * ```
		 * 
		 * **Composition of implicit path :**
		 * ```py
		 * dynamic-key   = ["%", 1*3("string" / "number" / "symbol")]
		 * static-key    = ["&", (string / number / symbol)]
		 * segment       = dynamic-key / static-key
		 * path          = [1*(...segment)]
		 * ```
		 * 
		 * **Exemple :**
		 * ```py
		 * my-path = ["&", "products", "%", "number", "&", "price"]
		 * my-path is products[0].price or products[1].price and continue
		 * ```
		 */
		getPartPaths(criteria: RegistryKey) {
			if (!this.registry.has(criteria)) throw new Issue(
				"Registry",
				"The criteria reference is not present in the current registry."
			);
	
			return (this.registry.get(criteria)!.partPaths);
		}
	});
}