import { parse } from "path";

export default class BufferedFile {
	public readonly content: Buffer;
	public readonly extension: string;
	public readonly name: string;

	constructor(filename: string, content: Buffer) {
		const { ext, name } = parse(filename);
		this.extension = ext;
		this.name = name;
		this.content = content;
	}
}
