export function weakly<O extends object>(callback: () => O): () => O {
	let ref: WeakRef<O> | null = null;

    return (() => {
		if (!ref) {
			const obj = callback();
			ref = new WeakRef(obj);
			return (obj);
		}
		
		const value = ref.deref();
		if (!value) {
			const obj = callback();
			ref = new WeakRef(obj);
			return (obj);
		}

		return (value);
    });
}

/**
 * @see https://www.garykessler.net/library/file_sigs.html
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 */
const signatures = [
	// Image
	{ ext: "png" as const, offset: 0, flags: ["89504E470D0A1A0A"]},
	{ ext: "jpg" as const, offset: 0, flags: ["FFD8FFE0"]},
	{ ext: "jp2" as const, offset: 0, flags: ["0000000C6A5020200D0A870A"]},
	{ ext: "gif" as const, offset: 0, flags: ["474946383761", "474946383961"]},
	{ ext: "webp" as const, offset: 0, flags: ["52494646????????57454250"]},
	// Audio
	{ ext: "mp3" as const, offset: 0, flags: ["FFFB", "FFF3", "FFF2", "494433"]},
	{ ext: "mp4" as const, offset: 4, flags: ["6674797069736F6D", "667479704D534E56"]},
	// 3D
	{ ext: "stl" as const, offset: 4, flags: ["736F6C6964"]}
];

export function hasFileSignature(hex: string, extensions: Array<(typeof signatures)[number]['ext']>) {
	for (let i = 0; i < extensions.length; i++) {
		const { offset, flags } = signatures.find(({ ext }) => ext === extensions[i])!;

		for (let i = 0; i < flags.length; i++) {
			const flag = flags[i];
			let j = (flag.length - 1) + offset;

			if (j >= hex.length) continue;
			while (j >= 0) {
				if (flag[j] !== "?" && hex[j] !== flag[j]) break;
				j--;
			}
			if (j === 0) return (true);
		}
	}
}