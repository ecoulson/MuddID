import { Arg, Mutation } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { finished } from "stream/promises";
import { ReadStream } from "fs-capacitor";
import annotateImage from "../annotate-image";
import { google } from "@google-cloud/vision/build/protos/protos";
import { DigitalId } from "../entities/DigitalId";
import { extractFace } from "../service/extract-face";

type GoogleImageAnnotation = google.cloud.vision.v1.IAnnotateImageResponse;

export class VerifierResolver {
	@Mutation(() => DigitalId)
	async uploadId(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename: fileName, mimetype, encoding }: FileUpload
	): Promise<DigitalId> {
		await this.saveUploadedFile(
			createReadStream(),
			fileName,
			mimetype,
			encoding
		);
		const annotations = await this.getIdAnnotations(fileName);
		await extractFace(fileName, annotations);
		return this.parseDigitalIdFromAnnotation(annotations);
	}

	private async saveUploadedFile(
		stream: ReadStream,
		fileName: string,
		mimetype: string,
		encoding: string
	) {
		const output = createWriteStream(fileName);
		stream.pipe(output);
		await finished(output);

		return { filename: fileName, mimetype, encoding };
	}

	private async getIdAnnotations(fileName: string) {
		const annotatedId = await annotateImage(fileName);
		return annotatedId;
	}

	private async parseDigitalIdFromAnnotation(
		annotations: GoogleImageAnnotation
	) {
		console.log(annotations);
		return new DigitalId("", "", "", "", "STUDENT", new Date());
	}
}
