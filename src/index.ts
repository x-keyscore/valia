export { Schema, SchemaCheck, SchemaGuard } from './schema';
export { stringToUTF16UnitArray } from './tools';
export * from './testers';
/*
const start = performance.now();
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
*/
/*
import { Schema, SchemaGuard } from "./schema";

function formatMemoryUsage(memoryUsage: any) {
	return Object.entries(memoryUsage).reduce((acc, [key, value]) => {
		// @ts-ignore
		acc[key] = `${(value / 1024 / 1024).toFixed(2)} MB`;
		return acc;
	}, {});
}

const bigdata: SchemaGuard<typeof userFormat> = {
	credential: {
		email: "test@test.ttt",
		password: "test*test"
	},
	profile: {
		firstName: "test",
		lastName: "test",
		color: "#000",
		avatar: "test",
		contact: {
			email: "testtest.ttt",
			phoneNumber: "0154852415"
		}
	},
	setting: {
		notification: true,
		theme: "DEFAULT"
	},
	sessions: [],
	permissions: []
};

let data: any = {};
let nbrElem = 10;
console.log("Number of properties :" + nbrElem);
for (let i = 0; i < nbrElem; i++) {
	data[`${i}`] = bigdata;
}

const userCredentiaFormat = new Schema({
	type: "struct",
	struct: {
		email: { type: "string", tester: { name: "isEmail" } },
		password: { type: "string" }
	}
});

const userProfileFormat = new Schema({
	type: "struct",
	struct: {
		firstName: { type: "string" },
		lastName: { type: "string" },
		color: { type: "string", regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ },
		avatar: { type: "string" },
		contact: {
			type: "struct",
			struct: {
				email: { type: "string", tester: { name: "isEmail" } },
				phoneNumber: { type: "string" }
			}
		}
	}
});

const userSettingFormat = new Schema({
	type: "struct",
	struct: {
		notification: { type: "boolean" },
		theme: { type: "string" }
	}
});

const userSessionFormat = new Schema({
	type: "struct",
	struct: {
		ip: {
			type: "struct",
			struct: {
				internal: {
					type: "string",
					tester: {
						name: "isIp",
						params: { allowIpV6: false }
					}
				},
				external: {
					type: "string",
					tester: {
						name: "isIp",
						params: { allowIpV6: false }
					}
				}
			}
		},
		agent: { type: "string" },
		token: { type: "string" }
	}
});

export const userFormat = new Schema({
	type: "struct",
	struct: {
		credential: userCredentiaFormat.criteria,
		profile: userProfileFormat.criteria,
		setting: userSettingFormat.criteria,
		sessions: { type: "array", max: 10, item: userSessionFormat.criteria },
		permissions: { type: "array", empty: true, item: { type: "string" } }
	}
});

const testSchema = new Schema({
	type: "record",
	key: { type: "string" },
	value: userFormat.criteria
});

const start = performance.now();
console.log(testSchema.check(data));
console.log(formatMemoryUsage(process.memoryUsage()));
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);

while (true) {}*/