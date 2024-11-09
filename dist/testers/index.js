"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = exports.isAsyncGenerator = exports.isGenerator = exports.isAsyncGeneratorFunction = exports.isGeneratorFunction = exports.isAsyncFunction = exports.isPlainFunction = exports.isArray = exports.isPlainObject = exports.isObject = exports.isBigint = exports.isNull = exports.isUndefined = exports.isSymbol = exports.isBoolean = exports.isNumber = exports.isString = void 0;
var primitives_1 = require("./primitives");
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return primitives_1.isString; } });
Object.defineProperty(exports, "isNumber", { enumerable: true, get: function () { return primitives_1.isNumber; } });
Object.defineProperty(exports, "isBoolean", { enumerable: true, get: function () { return primitives_1.isBoolean; } });
Object.defineProperty(exports, "isSymbol", { enumerable: true, get: function () { return primitives_1.isSymbol; } });
Object.defineProperty(exports, "isUndefined", { enumerable: true, get: function () { return primitives_1.isUndefined; } });
Object.defineProperty(exports, "isNull", { enumerable: true, get: function () { return primitives_1.isNull; } });
Object.defineProperty(exports, "isBigint", { enumerable: true, get: function () { return primitives_1.isBigint; } });
var auxiliaries_1 = require("./auxiliaries");
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return auxiliaries_1.isObject; } });
Object.defineProperty(exports, "isPlainObject", { enumerable: true, get: function () { return auxiliaries_1.isPlainObject; } });
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return auxiliaries_1.isArray; } });
Object.defineProperty(exports, "isPlainFunction", { enumerable: true, get: function () { return auxiliaries_1.isPlainFunction; } });
Object.defineProperty(exports, "isAsyncFunction", { enumerable: true, get: function () { return auxiliaries_1.isAsyncFunction; } });
Object.defineProperty(exports, "isGeneratorFunction", { enumerable: true, get: function () { return auxiliaries_1.isGeneratorFunction; } });
Object.defineProperty(exports, "isAsyncGeneratorFunction", { enumerable: true, get: function () { return auxiliaries_1.isAsyncGeneratorFunction; } });
Object.defineProperty(exports, "isGenerator", { enumerable: true, get: function () { return auxiliaries_1.isGenerator; } });
Object.defineProperty(exports, "isAsyncGenerator", { enumerable: true, get: function () { return auxiliaries_1.isAsyncGenerator; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "hasTag", { enumerable: true, get: function () { return utils_1.hasTag; } });
