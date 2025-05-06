/**
 * Composition :
 * * `letter = %d65-%d90 / %d97-%d122` A-Z / a-z
 * * `digit = %x30-39` 0-9
 * * `label = letter [*(digit / letter / "-") digit / letter]`
 * * `domain = label *("." label)`
 */
const domainRegex = new RegExp("^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\\.[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*$");

/**
 * **Standard :** RFC 1035
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
 * 
 * **Follows :**
 * `<domain>`
 * 
 * @version 1.0.0-beta
 */
export function isDomain(str: string, params?: undefined): boolean {
	return (domainRegex.test(str));
}
