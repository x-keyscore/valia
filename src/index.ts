export { Schema, SchemaCheck, SchemaGuard } from './schema';
export { stringToUTF16UnitArray } from './tools';
export * from './testers';
/*
const start = performance.now();
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
*/

import { Schema, SchemaGuard } from "./schema";

const userCredentiaFormat = new Schema({
	type: "struct",
	struct: {
		email: { type: "string", tester: { name: "isEmail" }},
		password: { type: "string" }
	}
});

const userProfileFormat = new Schema({
	type: "struct",
	struct: {
		firstName: { type: "string" },
		lastName: { type: "string" },
		color: { type: "string", regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ },
		avatar: { type: "string"},
		contact: {
			type: "struct",
			struct: {
				email: { type: "string", tester: { name: "isEmail" }},
				phoneNumber: { type: "string" }
			}
		}
	}
});

const userSettingFormat = new Schema({
	type: "struct",
	struct: {
		notification: { type: "boolean"},
		theme: { type: "string" }
	}
});

const userSessionFormat = new Schema({
	type: "struct",
	struct: {
		ip: {
			type: "struct",
			struct: {
				internal: { type: "string", tester: { name: "isIp", params: { allowIpV6: false } }},
				external: { type: "string", tester: { name: "isIp", params: { allowIpV6: false } }}
			}
		},
		agent: { type: "string" },
		token: { type: "string" }
	}
});

export const testSchema = new Schema({
	type: "record",
	key: { type: "string" },
	value: { type: "union", union: [{ type: "string"}, { type: "number"}]}
});

let data: any = {};

for (let i = 0; i < 100000; i++) {
	if (i % 2 === 0) data[`${i}`] = i
	else data[`${i}`] = `${i}`
}

testSchema.check(data);

const start = performance.now();
console.log(data);
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
