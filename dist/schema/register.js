"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const mounter_1 = require("./mounter");
const utils_1 = require("../utils");
class Register {
    constructor() {
        this.storage = new Map();
    }
    add(prevCriteria, currCriteria, data) {
        this.storage.set(currCriteria, {
            prev: prevCriteria,
            data
        });
    }
    merge(prevCriteria, currCriteria, data) {
        const sourceRegisterStorage = currCriteria[mounter_1.registerSymbol].storage;
        // MERGE REGISTER STORAGE
        this.storage = new Map([...this.storage, ...sourceRegisterStorage]);
        this.storage.set(currCriteria, {
            prev: prevCriteria,
            data
        });
    }
    getPath(criteria, separator) {
        let prev = this.storage.get(criteria);
        if (!prev)
            throw new utils_1.LibraryError("Register getPath", "The criteria reference was not found in the register");
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
exports.Register = Register;
