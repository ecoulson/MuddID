import { Arg, Field, Mutation, ObjectType } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { finished } from "stream/promises";

@ObjectType()
class FileResult {
	@Field()
	public filename: string;
	@Field()
	public mimetype: string;
	@Field()
	public encoding: string;
}

export class VerifierResolver {
	@Mutation(() => FileResult)
	async uploadId(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename, mimetype, encoding }: FileUpload
	): Promise<FileResult> {
		const stream = createReadStream();

		const output = createWriteStream("file.txt");
		stream.pipe(output);
		await finished(output);

		return { filename, mimetype, encoding };
	}
}
