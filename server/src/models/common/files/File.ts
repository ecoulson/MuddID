import { parse } from "path";

export default class File<ContentType> {
	public readonly extension: string;
	public readonly name: string;
	public readonly content: ContentType;

	constructor(filename: string, content: ContentType) {
		const { ext, name } = parse(filename);
		this.extension = ext;
		this.name = name;
		this.content = content;
	}

	baseName(): string {
		return this.name + this.extension;
	}
}
