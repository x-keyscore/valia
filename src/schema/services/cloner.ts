import type { SetableCriteria } from "../formats";
import { isArray, isBasicObject } from "../../testers";
import { hasNodeSymbol } from "./mounter";

interface CloningTask {
	src: unknown;
	cpy: any;
}

/**
 * Clones the object starting from the root and stops traversing a branch
 * when a mounted criteria node is encountered. In such cases, the mounted
 * object encountered see its internal properties copied to a new reference
 * so that the junction is a unique reference in the tree.
 * 
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
export function cloner<T extends SetableCriteria>(
	rootSrc: T
): T {
	let rootCpy = {};
	let stack: CloningTask[] = [{ 
		src: rootSrc, 
		cpy: rootCpy
	}];

	while (stack.length > 0) {
		let { src, cpy } = stack.pop()!;

		if (isBasicObject(src)) {
			if (hasNodeSymbol(src)) {
				cpy = { ...src };
			}
			else {
				const keys = Reflect.ownKeys(src);
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
	
					if (isBasicObject(src[key])) {
						if (hasNodeSymbol(src[key])) {
							cpy[key] = { ...src[key] };
						} else {
							cpy[key] = {};
	
							stack.push({
								src: src[key],
								cpy: cpy[key]
							});
						}
					} else if (isArray(src[key])) {
						cpy[key] = [];
	
						stack.push({
							src: src[key],
							cpy: cpy[key]
						});
					} else {
						cpy[key] = src[key];
					}
				}
			}
		}
		else if (isArray(src)) {
			for (let i = 0; i < src.length; i++) {
				const index = i;
	
				if (isBasicObject(src[index])) {
					if (hasNodeSymbol(src[index])) {
						cpy[i] = { ...src[index] };
					} else {
						cpy[i] = {};
	
						stack.push({
							src: src[index],
							cpy: cpy[index]
						});
					}
				} else if (isArray(src[index])) {
					cpy[index] = [];
	
					stack.push({
						src: src[index],
						cpy: cpy[index]
					});
				} else {
					cpy[index] = src[index];
				}
			}
		}
		else {
			cpy = src;
		}
	}

	return (rootCpy as T);
};