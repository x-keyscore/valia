interface IsAsciiConfig {
    /** **Default:** `false` */
	onlyPrintable?: boolean;
}

/**
 * Check if all characters of the string are in the ASCII table (%d0-%d127).
 * 
 * If you enable `onlyPrintable` valid characters will be limited to
 * printable characters from the ASCII table (%32-%d126).
 * 
 * Empty returns `false`.
 */
export function isAscii(str: string, config?: IsAsciiConfig): boolean {
    if (config?.onlyPrintable) return (RegExp("^[\\x20-\\x7E]+$").test(str))
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}