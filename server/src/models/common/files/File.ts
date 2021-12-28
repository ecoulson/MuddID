import { parse } from "path";

export default class File {
	public readonly extension: string;
	public readonly name: string;

	constructor(filename: string) {
		const { ext, name } = parse(filename);
		this.extension = ext;
		this.name = name;
	}
}
