"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default();
(0, ajv_formats_1.default)(ajv);
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
            email: "test@test.ttt",
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
let nbrElem = 100000;
console.log("Number of properties :" + nbrElem);
for (let i = 0; i < nbrElem; i++) {
    data[`${i}`] = structuredClone(bigdata);
    data[`${i}`].profile.firstName = "testv-" + i;
    data[`${i}`].profile.lastName = i + "-test";
    data[`${i}`].profile.contact.email = "test" + i + "d@test.ss";
    data[`${i}`].credential.email = "test" + i + "d@test.ss";
    data[`${i}`].setting.theme = "test-" + i;
}
const schema = {
    type: "object",
    additionalProperties: {
        type: "object",
        properties: {
            credential: {
                type: "object",
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" }
                },
                required: ["email", "password"],
                additionalProperties: false
            },
            profile: {
                type: "object",
                properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    color: { type: "string", pattern: "^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" },
                    avatar: { type: "string" },
                    contact: {
                        type: "object",
                        properties: {
                            email: { type: "string", format: "email" },
                            phoneNumber: { type: "string" }
                        },
                        required: ["email", "phoneNumber"],
                        additionalProperties: false
                    }
                },
                required: ["firstName", "lastName", "color", "avatar", "contact"],
                additionalProperties: false
            },
            setting: {
                type: "object",
                properties: {
                    notification: { type: "boolean" },
                    theme: { type: "string" }
                },
                required: ["notification", "theme"],
                additionalProperties: false
            },
            sessions: {
                type: "array",
                maxItems: 10,
                items: {
                    type: "object",
                    properties: {
                        ip: {
                            type: "object",
                            properties: {
                                internal: { type: "string", format: "ipv4" },
                                external: { type: "string", format: "ipv4" }
                            },
                            required: ["internal", "external"],
                            additionalProperties: false
                        },
                        agent: { type: "string" },
                        token: { type: "string" }
                    },
                    required: ["ip", "agent", "token"],
                    additionalProperties: false
                }
            },
            permissions: {
                type: "array",
                items: { "type": "string" },
                minItems: 0
            }
        },
        required: ["credential", "profile", "setting", "sessions", "permissions"],
        additionalProperties: false
    }
};
const validate = ajv.compile(schema);
const start2 = performance.now();
console.log(validate(data));
console.log(formatMemoryUsage(process.memoryUsage()));
const end2 = performance.now();
const timeTaken2 = end2 - start2;
console.log(`Execution Time: ${timeTaken2.toFixed(2)} ms`);
