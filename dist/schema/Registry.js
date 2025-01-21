"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = exports.registrySymbol = void 0;
const utils_1 = require("../utils");
exports.registrySymbol = Symbol('registry');
class Registry {
    constructor() {
        this.storage = new Map();
    }
    /**
     * Add a new criteria node to the registry.
     */
    add(prevCriteria, currCriteria, data) {
        this.storage.set(currCriteria, {
            prev: prevCriteria,
            data
        });
    }
    /**
     * Merging an unmounted criteria node with a mounted criteria node.
     */
    merge(prevCriteria, currCriteria, data) {
        const sourceRegisterStorage = currCriteria[exports.registrySymbol].storage;
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
    getPath(criteria, separator) {
        let prev = this.storage.get(criteria);
        if (!prev)
            throw new utils_1.LibraryError("Registry getPath", "The criteria reference was not found in the register");
        let fullPath = prev.data.pathParts.join(separator);
        while (prev.prev) {
            prev = this.storage.get(prev.prev);
            if (!prev)
                break;
            fullPath = prev.data.pathParts.join(separator) + separator + fullPath;
        }
        return (fullPath);
    }
}
exports.Registry = Registry;
