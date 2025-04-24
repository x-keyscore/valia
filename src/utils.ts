export class Issue extends Error {
	constructor(context: string, message: string, plugin?: string) {
		super(message);

		const red = "\x1b[31m", cyan = "\x1b[36m", gray = "\x1b[90m", reset = "\x1b[0m";
		const emitter = "Valia" + (plugin ? ":" + plugin : "");
		const timestamp = new Date().toISOString();

		this.message =
			`\n${red}[Error]${reset} ${cyan}[${emitter}]${reset} ${gray}${timestamp}${reset}` +
			`\nContext: ${context}` +
			`\nMessage: ${message}`;
	}
}

export function memory() {
	const memoryUsage = process.memoryUsage();
	console.log(
		`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB` +
		`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB` +
		`External: ${memoryUsage.external / 1024 / 1024} MB` +
		`RSS: ${memoryUsage.rss / 1024 / 1024} MB`
	);
}