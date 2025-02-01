"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = exports.mapperSymbol = void 0;
const utils_1 = require("../utils");
exports.mapperSymbol = Symbol('mapper');
class Mapper {
    constructor(rootCriteria, data) {
        this.references = new Map();
        this.references.set(rootCriteria, {
            prev: null,
            data
        });
    }
    /**
     * Add a new criteria node to the mapper.
     */
    add(prevCriteria, currCriteria, data) {
        this.references.set(currCriteria, {
            prev: prevCriteria,
            data
        });
    }
    /**
     * Merging an unmounted criteria node with a mounted criteria node.
     */
    merge(prevCriteria, currCriteria, data) {
        const sourceReferences = currCriteria[exports.mapperSymbol].references;
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
    getPath(criteria, separator) {
        let prev = this.references.get(criteria);
        if (!prev)
            throw new utils_1.Err("Registry", "The criteria reference was not found in the mapper.");
        let fullPath = prev.data.pathParts.join(separator);
        while (prev.prev) {
            prev = this.references.get(prev.prev);
            if (!prev)
                break;
            fullPath = prev.data.pathParts.join(separator) + separator + fullPath;
        }
        return (fullPath);
    }
}
exports.Mapper = Mapper;
