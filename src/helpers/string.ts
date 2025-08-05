function convertBase16ToBase32(input: string, base32: string, padding: boolean = true) {
	const totalChunksLength = Math.floor(input.length / 10) * 10;
	let output = "";
	let i = 0;

	while (i < totalChunksLength) {
		const decHigh = parseInt(input.slice(i, i + 5), 16);
		const decLow = parseInt(input.slice(i + 5, i + 10), 16);

		output += base32[((decHigh >> 15) & 31)]
			+ base32[((decHigh >> 10) & 31)]
			+ base32[((decHigh >> 5) & 31)]
			+ base32[(decHigh & 31)]
			+ base32[((decLow >> 15) & 31)]
			+ base32[((decLow >> 10) & 31)]
			+ base32[((decLow >> 5) & 31)]
			+ base32[(decLow & 31)];
		i += 10;
	}

	if (i < input.length) {
		const restChunk = input.slice(i, i + 5);
		// 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16 0
		const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
		const decHigh = parseInt(restChunk, 16) << leftShift;

		output += base32[((decHigh >> 15) & 31)]
			+ base32[((decHigh >> 10) & 31)];
		if (leftShift < 12) {
			output += base32[((decHigh >> 5) & 31)]
				+ base32[(decHigh & 31)];
		}
	}

	if (i + 5 < input.length) {
		const restChunk = input.slice(i + 5, i + 10);
		// 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16 0
		const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
		const decLow = parseInt(restChunk, 16) << leftShift;

		output += base32[((decLow >> 15) & 31)]
			+ base32[((decLow >> 10) & 31)];
		if (leftShift < 12) output += base32[((decLow >> 5) & 31)];
		if (leftShift < 8) output += base32[(decLow & 31)];
	}

	while (padding && output.length % 8 !== 0) {
		output += '=';
	}

	return (output);
}

function convertBase16ToBase64(input: string, base64: string, padding: boolean) {
	const totalChunksLength = Math.floor(input.length / 6) * 6;
	let output = "";
	let i = 0;

	while (i < totalChunksLength) {
		const dec = parseInt(input.slice(i, i + 6), 16);
		output += (base64[((dec >> 18) & 63)]
			+ base64[((dec >> 12) & 63)] 
			+ base64[((dec >> 6) & 63)]
			+ base64[(dec & 63)]);
		i += 6;
	}

	if (i < input.length) {
		const restChunk = input.slice(i, i + 6);
		// 143016576 = 00100 01000 01100 10000 10100 00000 = 4 8 12 16 20 0
		const leftShift = (143016576 >> (restChunk.length * 5)) & 31;
		const dec = parseInt(restChunk, 16) << leftShift;

		output += base64[((dec >> 18) & 63)]
			+ base64[((dec >> 12) & 63)];
		if (leftShift < 12) output += base64[((dec >> 6) & 63)];
		if (leftShift < 8) output += base64[(dec & 63)];
	}

	while (padding && output.length % 4 !== 0) {
		output += '=';
	}

	return (output);
}

function convertBase32ToBase16(input: string, base32: string) {
	if (input.endsWith("=")) input = input.slice(0, input.indexOf("="));
	const totalChunksLength = Math.floor(input.length / 8) * 8;
	const base16 = "0123456789ABCDEF";
	let output = "";
	let i = 0;

	while (i < totalChunksLength) {
		const dec = (base32.indexOf(input[i]) << 15)
			| (base32.indexOf(input[i + 1]) << 10)
			| (base32.indexOf(input[i + 2]) << 5)
			| base32.indexOf(input[i + 3]);

		output += base16[((dec >> 16) & 15)]
			+ base16[((dec >> 12) & 15)]
			+ base16[((dec >> 8) & 15)]
			+ base16[((dec >> 4) & 15)]
			+ base16[(dec & 15)];
		i += 4;
	}

	if (i < input.length) {
		const rest = input.slice(i);
		const restLength = rest.length;
		const dec = ((base32.indexOf(rest[0]) << 15)
			| (rest[1] ? base32.indexOf(rest[1]) << 10 : 0)
			| (rest[2] ? base32.indexOf(rest[2]) << 5 : 0)
			| (rest[3] ? base32.indexOf(rest[3]) : 0));

		output += base16[((dec >> 16) & 15)]
			+ base16[((dec >> 12) & 15)];
		if (restLength > 1) {
			output += base16[((dec >> 8) & 15)]
				+ base16[((dec >> 4) & 15)];
		}
		if (restLength > 3) {
			output += base16[(dec & 15)]
			if (i + 5 >= input.length) {
				output += base16[0];
			}
		}
	}

	if (i + 5 < input.length) {
		const rest = input.slice(i + 5);
		const restLength = rest.length;
		const dec = ((base32.indexOf(rest[0]) << 15)
			| (rest[1] ? base32.indexOf(rest[1]) << 10 : 0)
			| (rest[2] ? base32.indexOf(rest[2]) << 5 : 0)
			| (rest[3] ? base32.indexOf(rest[3]) : 0));

		output += base16[((dec >> 16) & 15)]
			+ base16[((dec >> 12) & 15)]
			+ base16[((dec >> 8) & 15)];
		if (restLength > 2) {
			output += base16[((dec >> 4) & 15)]
				+ base16[(dec & 15)];
		}
	}

	return (output);
}

function convertBase64ToBase16(input: string, base64: string) {
	if (input.endsWith("=")) input = input.slice(0, input.indexOf("="));
	const totalChunksLength = Math.floor(input.length / 4) * 4;
	const base16 = "0123456789ABCDEF";
	let output = "";
	let i = 0;

	while (i < totalChunksLength) {
		const dec = (base64.indexOf(input[i]) << 18)
			| (base64.indexOf(input[i + 1]) << 12)
			| (base64.indexOf(input[i + 2]) << 6)
			| base64.indexOf(input[i + 3]);

		output += base16[((dec >> 20) & 15)]
			+ base16[((dec >> 16) & 15)]
			+ base16[((dec >> 12) & 15)]
			+ base16[((dec >> 8) & 15)]
			+ base16[((dec >> 4) & 15)]
			+ base16[(dec & 15)];
		i += 4;
	}

	if (i < input.length) {
		const rest = input.slice(i);
		const restLength = rest.length;
		const dec = ((base64.indexOf(rest[0]) << 18)
			| (rest[1] ? base64.indexOf(rest[1]) << 12 : 0)
			| (rest[2] ? base64.indexOf(rest[2]) << 6 : 0)
			| (rest[3] ? base64.indexOf(rest[3]) : 0));

		output += base16[((dec >> 20) & 15)]
			+ base16[((dec >> 16) & 15)];
		if (restLength > 2) {
			output += base16[((dec >> 12) & 15)]
				+ base16[((dec >> 8) & 15)];
		}
		if (restLength > 3) {
			output += base16[((dec >> 4) & 15)]
				+ base16[(dec & 15)];
		}
	}

	return (output);
}

const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const base32Hex = "0123456789ABCDEFGHIJKLMNOPQRSTUV";

const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function base16ToBase32(str: string, to: "B32" | "B32HEX" = "B32", padding: boolean = true) {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (typeof to !== "string") {
		throw new Error("The 'to' argument must be of type string.");
	}
	if (typeof padding !== "boolean") {
		throw new Error("The 'string' argument must be of type boolean.");
	}

	if (to === "B32") return (convertBase16ToBase32(str, base32, padding));
	if (to === "B32HEX") return (convertBase16ToBase32(str, base32Hex, padding));

	throw new Error("The 'to' argument must be a known string.");
}

export function base16ToBase64(str: string, to: "B64" | "B64URL" = "B64", padding: boolean = true) {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (typeof to !== "string") {
		throw new Error("The 'to' argument must be of type string.");
	}
	if (typeof padding !== "boolean") {
		throw new Error("The 'string' argument must be of type boolean.");
	}

	if (to === "B64") return (convertBase16ToBase64(str, base64, padding));
	if (to === "B64URL") return (convertBase16ToBase64(str, base64Url, padding));

	throw new Error("The 'to' argument must be a known string.");
}

export function base32ToBase16(str: string, from: "B32" | "B32HEX" = "B32") {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (typeof from !== "string") {
		throw new Error("The 'to' argument must be of type string.");
	}

	if (from === "B32") return (convertBase32ToBase16(str, base32));
	if (from === "B32HEX") return (convertBase32ToBase16(str, base32Hex));

	throw new Error("The 'from' argument must be a known string.");
}

export function base64ToBase16(str: string, from: "B64" | "B64URL" = "B64") {
	if (typeof str !== "string") {
		throw new Error("The 'str' argument must be of type string.");
	}
	if (typeof from !== "string") {
		throw new Error("The 'to' argument must be of type string.");
	}

	if (from === "B64") return (convertBase64ToBase16(str, base64));
	if (from === "B64URL") return (convertBase64ToBase16(str, base64Url));

	throw new Error("The 'from' argument must be a known string.");
}