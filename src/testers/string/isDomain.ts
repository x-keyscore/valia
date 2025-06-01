<<<<<<< HEAD
/*
Composition :
    letter = %d65-%d90 / %d97-%d122; A-Z / a-z
    digit  = %x30-39; 0-9
    label  = letter [*(digit / letter / "-") digit / letter]
    domain = label *("." label)

Links :
    https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.1
*/

=======
/**
 * Composition :
 * * `letter = %d65-%d90 / %d97-%d122` A-Z / a-z
 * * `digit = %x30-39` 0-9
 * * `label = letter [*(digit / letter / "-") digit / letter]`
 * * `domain = label *("." label)`
 */
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
const domainRegex = new RegExp("^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\\.[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*$");

/**
 * **Standard :** RFC 1035
 * 
<<<<<<< HEAD
 * @version 1.0.0
 */
export function isDomain(str: string, params?: undefined): boolean {
	return (domainRegex.test(str));
}
=======
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
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
