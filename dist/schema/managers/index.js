"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsManager = exports.formatsManager = exports.registryManager = void 0;
var registry_1 = require("./registry");
Object.defineProperty(exports, "registryManager", { enumerable: true, get: function () { return registry_1.registryManager; } });
var formats_1 = require("./formats");
Object.defineProperty(exports, "formatsManager", { enumerable: true, get: function () { return formats_1.formatsManager; } });
var events_1 = require("./events");
Object.defineProperty(exports, "eventsManager", { enumerable: true, get: function () { return events_1.eventsManager; } });
