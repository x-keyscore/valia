import { describe, it } from "node:test";
import assert from "node:assert";

import { AbstractPlugin, SchemaPlugins } from "../../dist/index.js";

describe("Schema global criteria", () => {
    it("schema plugin '1' plugin", () => {
        class Plugin extends AbstractPlugin {
            foo() { return ("foo_result"); }
            beforeInitate() {}
            afterInitate() {}
        
            constructor(...args) {
                super(...args)
            }
        }

        const Schema = SchemaPlugins(Plugin);
        const schemaInstance = new Schema({ type: "string" });

        assert.strictEqual(schemaInstance.validate("test"), true);
        assert.strictEqual(schemaInstance.foo(), "foo_result");
    });
    it("schema plugin '2' plugin", () => {
        class Plugin_1 extends AbstractPlugin {
            foo() { return ("foo_result"); }
            beforeInitate() {}
            afterInitate() {}
        
            constructor(...args) {
                super(...args)
            }
        }

        class Plugin_2 extends AbstractPlugin {
            bar() { return ("bar_result"); }
            beforeInitate() {}
            afterInitate() {}
        
            constructor(...args) {
                super(...args)
            }
        }

        const Schema = SchemaPlugins(Plugin_1, Plugin_2);
        const schemaInstance = new Schema({ type: "string" });

        assert.strictEqual(schemaInstance.validate("test"), true);
        assert.strictEqual(schemaInstance.foo(), "foo_result");
        assert.strictEqual(schemaInstance.bar(), "bar_result");
    });
    it("schema plugin key conflict", () => {
        class Plugin_1 extends AbstractPlugin {
            foo() {}
            beforeInitate() {}
            afterInitate() {}
        
            constructor(...args) {
                super(...args)
            }
        }

        class Plugin_2 extends AbstractPlugin {
            foo() {}
            beforeInitate() {}
            afterInitate() {}

            constructor(...args) {
                super(...args)
            }
        }

        assert.throws(() => {
			SchemaPlugins(Plugin_1, Plugin_2);
		}, Error);
    });
});