export class Err extends Error {
	printError(context: string) {
		const timestamp = new Date().toISOString();

		const red = '\x1b[31m';
		const gray = '\x1b[90m';
		const cyan = '\x1b[36m';
		const yellow = '\x1b[33m';
		const reset = '\x1b[0m';

		console.log(
			`${red}[ERROR]${reset} ${cyan}[valie]${reset} ${gray}${timestamp}${reset}` +
			`\nContext: ${context}` +
			`\nMessage: ${this.message}`
			
		);
	}

    constructor(context: string, message: string) {
        super(message);
        this.printError(context);
    }
}