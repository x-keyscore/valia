
/**
 * Check if all characters in the string are part of the ASCII table.
 * 
 * An empty string will return `false`.
 */
export function isAscii(str: string, options?: undefined): boolean {
    return (RegExp("^[\\x00-\\x7F]+$").test(str));
}