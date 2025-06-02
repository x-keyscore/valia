import { describe, it, before } from "node:test";
import assert from "node:assert";

import { SchemaFactory, Issue } from "../../dist/index.js";

describe("\nschema / plugin", () => {
    describe("Mix of 1 plugin", () => {
        let plugin_1, schema_instance;

        before(() => {
            plugin_1 = function (definedCriteria) {
                return ({
                    formats: [],
                    foo_property: "foo_value",
                    foo_method() { return ("foo_result"); }
                });
            }

            const Schema_extended = SchemaFactory(plugin_1);
            schema_instance = new Schema_extended({ type: "string" });
        });

        it("the properties and methods of the plugin must be accessible", () => {
            assert.strictEqual(schema_instance.validate("test"), true);

            assert.strictEqual(schema_instance.foo_property, "foo_value");
            assert.strictEqual(schema_instance.foo_method(), "foo_result");
        });
    });

    describe("Mix of 2 plugins", () => {
        let plugin_1, plugin_2, schema_instance;

        before(() => {
            plugin_1 = function (definedCriteria) {
                return ({
                    formats: [],
                    foo_property: "foo_value",
                    foo_method() { return ("foo_result"); }
                });
            }

            plugin_2 = function (definedCriteria) {
                return ({
                    formats: [],
                    bar_property: "bar_value",
                    bar_method() { return ("bar_result"); }
                });
            }

            const Schema_extended = SchemaFactory(plugin_1, plugin_2);

            schema_instance = new Schema_extended({ type: "string" });
        });

        it("the properties and methods of the plugins must be accessible", () => {
            assert.strictEqual(schema_instance.validate("test"), true);

            assert.strictEqual(schema_instance.foo_property, "foo_value");
            assert.strictEqual(schema_instance.foo_method(), "foo_result");

            assert.strictEqual(schema_instance.bar_property, "bar_value");
            assert.strictEqual(schema_instance.bar_method(), "bar_result");
        });
    });

    describe("Mix of 2 plugins with identical key", () => {
        let plugin_1, plugin_2;

        before(() => {
            plugin_1 = function (definedCriteria) {
                return ({
                    formats: [],
                    foo_property: "foo_value",
                    foo_method() { return ("foo_result"); }
                });
            }

            plugin_2 = function (definedCriteria) {
                return ({
                    formats: [],
                    foo_property: "foo_value",
                    foo_method() { return ("foo_result"); }
                });
            }
        });

        it("should return an error because the plugin has an identical key", () => {
            assert.throws(() => {
                const Schema_extended = SchemaFactory(plugin_1, plugin_2);
                new Schema_extended({ type: "string" });
            }, Error);
        });
    });
});