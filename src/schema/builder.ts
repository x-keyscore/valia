import { formats, FormatsCriteria } from "../formats";
import { BuildedSchema, SchemaTreeNode, SchemaTreeNodeBranch } from "./types";
import { construct } from "./utils";

interface Task {
	criteria: FormatsCriteria;
	node: SchemaTreeNode;
	depth: number;
}

function assignFormatToNode(task: Task) {
	const constructor = formats[task.criteria.type];
	if (!constructor) throw new Error("Unknown format type");

	task.node.format = construct(constructor, [task.criteria]);
}

function assignBranchToNode(task: Task) {
	const { criteria, depth } = task;
	let ref: SchemaTreeNodeBranch;
	let queue: Task[] = [];

	let subDepth = depth + 1;
	if (criteria.type === "record") {
		ref = {
			branchType: "entry",
			branch: {}
		}

		const record = criteria.record;
		const keys = Object.keys(record);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			ref.branch[key] = {} as any;
			queue.push({
				criteria: record[key],
				node: ref.branch[key],
				depth: subDepth
			});
		}
	}
	else if (criteria.type === "array") {
		ref = {
			branchType: "array",
			branch: []
		}

		const array = criteria.array;
		for (let i = 0; i < array.length; i++) {
			ref.branch[i] = {} as any;
			queue.push({
				criteria: array[i],
				node: ref.branch[i],
				depth: subDepth
			});
		}
	} else {
		ref = {
			branchType: "empty",
			branch: null
		}
	}
	task.node.branchType = ref.branchType;
	task.node.branch = ref.branch;
	return (queue);
}

export function schemaBuilder(criteria: FormatsCriteria): BuildedSchema {
	let treeRoot: SchemaTreeNode | {} = {};
	let queue: Task[] = [{ criteria, node: treeRoot as any, depth: 0 }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		assignFormatToNode(currentTask);

		queue.push(...assignBranchToNode(currentTask));
	}
	console.log(treeRoot)
	return (treeRoot as BuildedSchema);
}