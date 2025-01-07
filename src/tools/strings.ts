/**
 * @param str string
 * @returns Returns a `Uint16Array` containing the unicode values ​​of each character in the string `str`,
 * if a character exceeds the 16-bit unit then it is encoded on two units.
 */
export function createUTF16UnitArray(str: string) {
	const utf16UnitArray = new Uint16Array(str.length);
	let i = 0;

	while (i < str.length) {
		const codePoint = str.codePointAt(i)!;

		if (codePoint > 0xFFFF) {
			// ADD HIGH SURROGATE
			utf16UnitArray[i++] = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
			// ADD LOW SURROGATE
			utf16UnitArray[i++] = (codePoint - 0x10000) % 0x400 + 0xDC00;
        } else {
			utf16UnitArray[i++] = codePoint;
        }
	}

    return (utf16UnitArray);
}

export function getUTF8ByteLengthFromCodePoint(codePoint: number): number {
    if (codePoint <= 0x7F) {
        return (1);
    } else if (codePoint <= 0x7FF) {
        return (2);
    } else if (codePoint <= 0xFFFF) {
        return (3);
    } else if (codePoint <= 0x10FFFF) {
        return (4);
    }
    return (0);
}

export function getUTF8ByteLengthFromUTF16UnitArray(utf16UnitArray: Uint16Array): number {
    let byteLength = 0;
    let i = 0;

    while (i < utf16UnitArray.length) {
        const unit = utf16UnitArray[i];

        // CHECK HIGH SURROGATE
        if (unit >= 0xD800 && unit <= 0xDBFF) {
            byteLength += getUTF8ByteLengthFromCodePoint(((unit - 0xD800) << 10)
				+ (utf16UnitArray[i + 1] - 0xDC00) + 0x10000);
            i += 2;
        } else {
            byteLength += getUTF8ByteLengthFromCodePoint(unit);
			i++;
		}
    }

    return (byteLength);
}