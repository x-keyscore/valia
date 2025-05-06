import type { SetableCriteria, FormatNativeNames } from "./formats";
import type { SchemaPlugin, SchemaInstance } from "./types";
import { Schema } from "./schema";
import { Issue } from "../utils";

type MixinPluginsCriteria<
	P1C, P1M extends SchemaPlugin,
	P2C, P2M extends SchemaPlugin,
	P3C, P3M extends SchemaPlugin
> = (
	// CHECK THAT 'P1C' IS NOT UNDEFINED
	P1C extends SetableCriteria
		// CHECK THAT 'P2C' IS NOT UNDEFINED
		? P2C extends SetableCriteria
			// CHECK THAT 'P3C' IS NOT UNDEFINED
			? P3C extends SetableCriteria
				// EXTENDS NECESSARY BECAUSE 'P3C' MAY CONTAIN UNAVAILABLE CRITERIA
				? SetableCriteria extends P3C
					? P1C | P2C | P3C
					: SetableCriteria<(P1M['formats'] | P2M['formats'] | P3M['formats'])[number]['type'] | FormatNativeNames>
				// EXTENDS NECESSARY BECAUSE 'P2C' MAY CONTAIN UNAVAILABLE CRITERIA
				: SetableCriteria extends P2C
					? P1C | P2C
					: SetableCriteria<(P1M['formats'] | P2M['formats'])[number]['type'] | FormatNativeNames>
			// EXTENDS NECESSARY BECAUSE 'P1C' MAY CONTAIN UNAVAILABLE CRITERIA
			: SetableCriteria extends P1C
				? P1C
				: SetableCriteria<P1M['formats'][number]['type'] | FormatNativeNames>
		: never
);

type MixinSchemaPlugin<
	P1C, P1M extends SchemaPlugin,
	P2C, P2M extends SchemaPlugin,
	P3C, P3M extends SchemaPlugin
> =
	// CHECK THAT 'P1C' IS NOT UNDEFINED
	P1C extends SetableCriteria
		// CHECK THAT 'P2C' IS NOT UNDEFINED
		? P2C extends SetableCriteria
			// CHECK THAT 'P3C' IS NOT UNDEFINED
			? P3C extends SetableCriteria
				? SchemaInstance<P1C & P2C & P3C> & P1M & P2M & P3M
				: SchemaInstance<P1C & P2C> & P1M & P2M
			: SchemaInstance<P1C> & P1M
		: never;

type MixinPlugins<
	P1C, P1M extends SchemaPlugin,
	P2C, P2M extends SchemaPlugin,
	P3C, P3M extends SchemaPlugin
> = new (...args: [MixinPluginsCriteria<P1C, P1M, P2C, P2M, P3C, P3M>]) => Omit<MixinSchemaPlugin<P1C, P1M, P2C, P2M, P3C, P3M>, "formats">;

export function SchemaFactory<
	P1C extends SetableCriteria, P1M extends SchemaPlugin,
	P2C = unknown, P2M extends SchemaPlugin = never,
	P3C = unknown, P3M extends SchemaPlugin = never
>(
	plugin1: (...args: [P1C]) => P1M,
	plugin2?: (...args: [P2C]) => P2M,
	plugin3?: (...args: [P3C]) => P3M
): MixinPlugins<P1C, P1M, P2C, P2M, P3C, P3M> {
	return class <const T extends P1C & P2C & P3C> extends Schema<T> {
		constructor(criteria: T) {
			super(criteria);

			const assignPlugin = (plugin: SchemaPlugin) => {
				const { formats, ...members } = plugin;

				for (const key in members) {
					if (key in this) throw new Issue(
						"Schema Factory",
						`Conflictual keys: '${key}'`
					);
				}
				Object.assign(this, members);
				this.managers.formats.add(formats);
			};

			assignPlugin(plugin1.call(this, criteria));
			if (plugin2) assignPlugin(plugin2.call(this, criteria));
			if (plugin3) assignPlugin(plugin3.call(this, criteria));

			this.initiate(criteria);
		}
	} as any;
}

/*
import type { SetableCriteriaTemplate, GuardedCriteria, Format } from "./formats";
import { SpecTypesTemplate, FlowTypesTemplate } from "./formats/types";

export interface MongoIdSetableCriteria extends SetableCriteriaTemplate<"mongoId"> {
	mongoParam: boolean;
}

export interface MongoIdSpecTypes extends SpecTypesTemplate<
	MongoIdSetableCriteria,
	{}
> {}

export interface MongoIdFlowTypes extends FlowTypesTemplate<
	{},
	string
> {}

declare module './formats/types' {
	interface FormatSpecTypes {
		mongoId: MongoIdSpecTypes;
	}
	interface FormatFlowTypes<T extends SetableCriteria> {
		mongoId: T extends MongoIdSetableCriteria ? MongoIdFlowTypes : never;
	}
}

const MongoIdFormat: Format<MongoIdSetableCriteria> = {
	type: "mongoId",
	defaultCriteria: {},
	mount(chunk, criteria) {
		
	},
	check(chunk, criteria, value) {
		return (null);
	},
}

function plugin_A<T extends SetableCriteria>(this: SchemaInstance<T>, definedCriteria: T) {
	return ({
		formats: [MongoIdFormat],
		mongo(data: GuardedCriteria<T>) {
			
		}
	} satisfies SchemaPlugin);
}

const SchemaA = SchemaFactory(plugin_A);

const InstanceA = new SchemaA({ type: "mongoId", mongoParam: true });
*/



/*
import type { SetableCriteriaTemplate, GuardedCriteria, Format } from "./formats";
import { SpecTypesTemplate, FlowTypesTemplate } from "./formats/types";

export interface MongoIdSetableCriteria extends SetableCriteriaTemplate<"mongoId"> {
	mongoParam: boolean;
}

export interface MongoIdSpecTypes extends SpecTypesTemplate<
	MongoIdSetableCriteria,
	{}
> {}

export interface MongoIdFlowTypes extends FlowTypesTemplate<
	{},
	string
> {}

export interface MariaIdSetableCriteria extends SetableCriteriaTemplate<"mariaId"> {
	mariaParam: boolean;
}

export interface MariaIdSpecTypes extends SpecTypesTemplate<
	MariaIdSetableCriteria,
	{}
> {}

export interface MariaIdFlowTypes extends FlowTypesTemplate<
	{},
	number
> {}

declare module './formats/types' {
	interface FormatSpecTypes {
		mongoId: MongoIdSpecTypes;
		mariaId: MariaIdSpecTypes;
	}
	interface FormatFlowTypes<T extends SetableCriteria> {
		mongoId: T extends MongoIdSetableCriteria ? MongoIdFlowTypes : never;
		mariaId: T extends MariaIdSetableCriteria ? MariaIdFlowTypes : never;
	}
}

const MongoIdFormat: Format<MongoIdSetableCriteria> = {
	type: "mongoId",
	defaultCriteria: {},
	mount(chunk, criteria) {
		
	},
	check(chunk, criteria, value) {
		return (null);
	},
}

const MariaIdFormat: Format<MariaIdSetableCriteria> = {
	type: "mariaId",
	defaultCriteria: {},
	mount(chunk, criteria) {
		
	},
	check(chunk, criteria, value) {
		return (null);
	},
}

function plugin_A<T extends SetableCriteria>(definedCriteria: T) {
	return ({
		formats: [MongoIdFormat],
		foo(data: GuardedCriteria<T>) {
			
		},
		bar(data: GuardedCriteria<T>) {
		
		}
	} satisfies PluginRequirement);
}

function plugin_B<T extends SetableCriteria>(this: SchemaInstance<T>, criteria: T) {
	const context = this;

	return ({
		formats: [MariaIdFormat],
		plugin_B_1(data: GuardedCriteria<T>) {
			return (context.criteria)
		}
	} satisfies PluginRequirement);
}

const Tessss = SchemaComposer(plugin_A, plugin_B);//, plugin_B//, plugin_B

const t1cccccc = new Tessss({ type: "mongoId", mongoParam: true });

const t2cccccc = new Tessss({ type: "struct", struct: { test: { type: "string" }} });

t2cccccc.plugin_B_1({ test: ""})*/