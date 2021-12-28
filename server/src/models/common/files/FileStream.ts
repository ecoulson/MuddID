import { ReadStream } from "fs";
import File from "./File";

export default class FileStream extends File {
	public readonly stream: ReadStream;

	constructor(filename: string, stream: ReadStream) {
		super(filename);
		this.stream = stream;
	}
}
