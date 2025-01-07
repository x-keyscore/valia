"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = exports.tools = exports.isAsyncGenerator = exports.isGenerator = exports.isAsyncGeneratorFunction = exports.isGeneratorFunction = exports.isAsyncFunction = exports.isPlainFunction = exports.isArray = exports.isPlainObject = exports.isObject = exports.objects = exports.isNull = exports.isUndefined = exports.isSymbol = exports.isBigint = exports.isNumber = exports.isString = exports.isBoolean = exports.primitives = exports.isIp = exports.isDigit = exports.isAlpha = exports.isEmail = exports.isAscii = exports.isPhone = exports.isDomain = exports.strings = void 0;
exports.strings = __importStar(require("./strings"));
var strings_1 = require("./strings");
Object.defineProperty(exports, "isDomain", { enumerable: true, get: function () { return strings_1.isDomain; } });
Object.defineProperty(exports, "isPhone", { enumerable: true, get: function () { return strings_1.isPhone; } });
Object.defineProperty(exports, "isAscii", { enumerable: true, get: function () { return strings_1.isAscii; } });
Object.defineProperty(exports, "isEmail", { enumerable: true, get: function () { return strings_1.isEmail; } });
Object.defineProperty(exports, "isAlpha", { enumerable: true, get: function () { return strings_1.isAlpha; } });
Object.defineProperty(exports, "isDigit", { enumerable: true, get: function () { return strings_1.isDigit; } });
Object.defineProperty(exports, "isIp", { enumerable: true, get: function () { return strings_1.isIp; } });
exports.primitives = __importStar(require("./primitives"));
var primitives_1 = require("./primitives");
Object.defineProperty(exports, "isBoolean", { enumerable: true, get: function () { return primitives_1.isBoolean; } });
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return primitives_1.isString; } });
Object.defineProperty(exports, "isNumber", { enumerable: true, get: function () { return primitives_1.isNumber; } });
Object.defineProperty(exports, "isBigint", { enumerable: true, get: function () { return primitives_1.isBigint; } });
Object.defineProperty(exports, "isSymbol", { enumerable: true, get: function () { return primitives_1.isSymbol; } });
Object.defineProperty(exports, "isUndefined", { enumerable: true, get: function () { return primitives_1.isUndefined; } });
Object.defineProperty(exports, "isNull", { enumerable: true, get: function () { return primitives_1.isNull; } });
exports.objects = __importStar(require("./objects"));
var objects_1 = require("./objects");
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return objects_1.isObject; } });
Object.defineProperty(exports, "isPlainObject", { enumerable: true, get: function () { return objects_1.isPlainObject; } });
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return objects_1.isArray; } });
Object.defineProperty(exports, "isPlainFunction", { enumerable: true, get: function () { return objects_1.isPlainFunction; } });
Object.defineProperty(exports, "isAsyncFunction", { enumerable: true, get: function () { return objects_1.isAsyncFunction; } });
Object.defineProperty(exports, "isGeneratorFunction", { enumerable: true, get: function () { return objects_1.isGeneratorFunction; } });
Object.defineProperty(exports, "isAsyncGeneratorFunction", { enumerable: true, get: function () { return objects_1.isAsyncGeneratorFunction; } });
Object.defineProperty(exports, "isGenerator", { enumerable: true, get: function () { return objects_1.isGenerator; } });
Object.defineProperty(exports, "isAsyncGenerator", { enumerable: true, get: function () { return objects_1.isAsyncGenerator; } });
exports.tools = __importStar(require("./tools"));
var tools_1 = require("./tools");
Object.defineProperty(exports, "hasTag", { enumerable: true, get: function () { return tools_1.hasTag; } });
