import type { SetableCriteria, FormatNativeNames } from "./formats";
import type { PluginRequirement, SchemaInstance } from "./types";
import { Schema } from "./schema";
import { Issue } from "../utils";

type MixinPluginsCriteria<
	P1C, P1M extends PluginRequirement,
	P2C, P2M extends PluginRequirement,
	P3C, P3M extends PluginRequirement
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

type MixinPluginsMembers<
	P1C, P1M extends PluginRequirement,
	P2C, P2M extends PluginRequirement,
	P3C, P3M extends PluginRequirement
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
	P1C, P1M extends PluginRequirement,
	P2C, P2M extends PluginRequirement,
	P3C, P3M extends PluginRequirement
> = new (...args: [MixinPluginsCriteria<P1C, P1M, P2C, P2M, P3C, P3M>]) => MixinPluginsMembers<P1C, P1M, P2C, P2M, P3C, P3M>;

export function SchemaComposer<
	P1C extends SetableCriteria, P1M extends PluginRequirement,
	P2C = unknown, P2M extends PluginRequirement = never,
	P3C = unknown, P3M extends PluginRequirement = never
>(
	plugin1: (...args: [P1C]) => P1M,
	plugin2?: (...args: [P2C]) => P2M,
	plugin3?: (...args: [P3C]) => P3M
): MixinPlugins<P1C, P1M, P2C, P2M, P3C, P3M> {
	return class SchemaComposed<const T extends P1C & P2C & P3C> extends Schema<T> {
		constructor(criteria: T) {
			super(criteria);

			const mixinPlugin = (plugin: PluginRequirement) => {
				const { formats, ...members } = plugin;

				for (const key in members) {
					if (key in this) throw new Issue(
						"Schema Composer",
						`Conflictual keys: '${key}'`
					);
				}
				this.managers.formats.add(formats);
				Object.assign(this, members);
			};

			mixinPlugin(plugin1.call(this, criteria));
			if (plugin2) mixinPlugin(plugin2.call(this, criteria));
			if (plugin3) mixinPlugin(plugin3.call(this, criteria));

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