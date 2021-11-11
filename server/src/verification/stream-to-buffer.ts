import { ReadStream } from "fs";

export function streamToBuffer(stream: ReadStream) {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks = Array<any>();
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", (e) => reject(e));
		stream.on("end", () => resolve(Buffer.concat(chunks)));
	});
}
