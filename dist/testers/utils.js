"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = hasTag;
exports.createUTF16UnitArray = createUTF16UnitArray;
exports.getUTF8ByteLengthFromUTF16UnitArray = getUTF8ByteLengthFromUTF16UnitArray;
function hasTag(x, tag) {
    return (Object.prototype.toString.call(x).slice(8, -1) === tag);
}
function createUTF16UnitArray(str) {
    const unitArray = new Uint16Array(str.length);
    let i = 0;
    while (i < str.length) {
        const codePoint = str.codePointAt(i);
        if (codePoint > 0xFFFF) {
            // ADD HIGH SURROGATE
            unitArray[i++] = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
            // ADD LOW SURROGATE
            unitArray[i++] = (codePoint - 0x10000) % 0x400 + 0xDC00;
        }
        else {
            unitArray[i++] = codePoint;
        }
    }
    return (unitArray);
}
function getUTF8ByteLengthFromCodePoint(codePoint) {
    if (codePoint <= 0x7F) {
        return (1);
    }
    else if (codePoint <= 0x7FF) {
        return (2);
    }
    else if (codePoint <= 0xFFFF) {
        return (3);
    }
    else if (codePoint <= 0x10FFFF) {
        return (4);
    }
    return (0);
}
function getUTF8ByteLengthFromUTF16UnitArray(unitArray) {
    let byteLength = 0;
    let i = 0;
    while (i < unitArray.length) {
        const unit = unitArray[i];
        // CHECK HIGH SURROGATE
        if (unit >= 0xD800 && unit <= 0xDBFF) {
            byteLength += getUTF8ByteLengthFromCodePoint(((unit - 0xD800) << 10)
                + (unitArray[i + 1] - 0xDC00) + 0x10000);
            i += 2;
        }
        else {
            byteLength += getUTF8ByteLengthFromCodePoint(unit);
            i++;
        }
    }
    return (byteLength);
}
