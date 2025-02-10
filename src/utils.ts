export class Err extends Error {
	print(context: string, plugin?: string) {
		const timestamp = new Date().toISOString();
		const red = '\x1b[31m';
		const gray = '\x1b[90m';
		const cyan = '\x1b[36m';
		const reset = '\x1b[0m';

		console.log(
			`${red}[ERROR]${reset} ${cyan}[valie${plugin ? `:${plugin}` : ""}]${reset} ${gray}${timestamp}${reset}` +
			`\nContext: ${context}` +
			`\nMessage: ${this.message}`
		);
	}

    constructor(context: string, message: string, plugin?: string) {
        super(message);
        this.print(context, plugin);
    }
}