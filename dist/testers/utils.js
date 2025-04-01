"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazy = lazy;
exports.hasFileSignature = hasFileSignature;
function lazy(callback) {
    let ref = null, val = null;
    // Test 'WeakRef' support
    if (typeof WeakRef !== "undefined") {
        ref = undefined;
    }
    return () => {
        if (ref !== null) {
            const temp = ref === null || ref === void 0 ? void 0 : ref.deref();
            if (!temp) {
                ref = new WeakRef(callback());
                return (ref.deref());
            }
            return (temp);
        }
        else if (val === null) {
            val = callback();
        }
        return (val);
    };
}
/**
 * @see https://www.garykessler.net/library/file_sigs.html
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 */
const signatures = [
    // Image
    { ext: "png", offset: 0, flags: ["89504E470D0A1A0A"] },
    { ext: "jpg", offset: 0, flags: ["FFD8FFE0"] },
    { ext: "jp2", offset: 0, flags: ["0000000C6A5020200D0A870A"] },
    { ext: "gif", offset: 0, flags: ["474946383761", "474946383961"] },
    { ext: "webp", offset: 0, flags: ["52494646????????57454250"] },
    // Audio
    { ext: "mp3", offset: 0, flags: ["FFFB", "FFF3", "FFF2", "494433"] },
    { ext: "mp4", offset: 4, flags: ["6674797069736F6D", "667479704D534E56"] },
    // 3D
    { ext: "stl", offset: 4, flags: ["736F6C6964"] }
];
function hasFileSignature(hex, extensions) {
    for (let i = 0; i < extensions.length; i++) {
        const { offset, flags } = signatures.find(({ ext }) => ext === extensions[i]);
        for (let i = 0; i < flags.length; i++) {
            const flag = flags[i];
            let j = (flag.length - 1) + offset;
            if (j >= hex.length)
                continue;
            while (j >= 0) {
                if (flag[j] !== "?" && hex[j] !== flag[j])
                    break;
                j--;
            }
            if (j === 0)
                return (true);
        }
    }
}
