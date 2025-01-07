"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringKinds = void 0;
/** Divides into 3 groups : "**0**@**1**.**2**" */
const emailRegexDivider = /^([^@]+)@(.+)\.([a-zA-Z]{2,})$/;
/** RFC 5322 */
const emailRegexIdentifier = new RegExp(/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/);
/** RFC 5322 */
const emailRegexSubdomain = new RegExp(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/);
/** RFC 5322 */
const emailRegexTLD = new RegExp(/^[a-zA-Z]{2,}$/);
class StringKinds {
    email(params, value) {
        const valueGroup = emailRegexDivider.exec(value);
        if (!valueGroup || valueGroup.length !== 3) {
            return ("INVALID_EMAIL");
        }
        if (params.identifier && !params.identifier.test(valueGroup[0])) {
        }
        if (params.subdomain && !params.subdomain.test(valueGroup[1])) {
        }
        if (params.TLD && !params.TLD.test(valueGroup[2])) {
        }
    }
}
exports.StringKinds = StringKinds;
//type FirstArgConstructor<T> = T extends new (arg: infer U, ...args: any[]) => any ? U : never;
