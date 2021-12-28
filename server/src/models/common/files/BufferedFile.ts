import File from "./File";

export default class BufferedFile extends File {
	public readonly content: Buffer;

	constructor(filename: string, content: Buffer) {
		super(filename);
		this.content = content;
	}
}
