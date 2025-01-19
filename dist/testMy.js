"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFormat = void 0;
const schema_1 = require("./schema");
function formatMemoryUsage(memoryUsage) {
    return Object.entries(memoryUsage).reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[key] = `${(value / 1024 / 1024).toFixed(2)} MB`;
        return acc;
    }, {});
}
const bigdata = {
    credential: {
        email: "test@test.ttt",
        password: "test/*/*test"
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
let data = {};
let nbrElem = 10;
console.log("Number of properties :" + nbrElem);
for (let i = 0; i < nbrElem; i++) {
    data[`${i}`] = bigdata;
}
const userCredentiaFormat = new schema_1.Schema({
    type: "struct",
    struct: {
        email: { type: "string", tester: { name: "isEmail" } },
        password: { type: "string" }
    }
});
const userProfileFormat = new schema_1.Schema({
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
const userSettingFormat = new schema_1.Schema({
    type: "struct",
    struct: {
        notification: { type: "boolean" },
        theme: { type: "string" }
    }
});
const userSessionFormat = new schema_1.Schema({
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
exports.userFormat = new schema_1.Schema({
    type: "struct",
    struct: {
        credential: userCredentiaFormat.criteria,
        profile: userProfileFormat.criteria,
        setting: userSettingFormat.criteria,
        sessions: { type: "array", max: 10, item: userSessionFormat.criteria },
        permissions: { type: "array", empty: true, item: { type: "string" } }
    }
});
const testSchema = new schema_1.Schema({
    type: "record",
    key: { type: "string" },
    value: exports.userFormat.criteria
});
const start = performance.now();
console.log(testSchema.check(data));
console.log(formatMemoryUsage(process.memoryUsage()));
const end = performance.now();
const timeTaken = end - start;
console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
