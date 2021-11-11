import { Arg, Mutation } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ReadStream } from "fs";
import annotateImage from "../verification/annotate-image";
import { DigitalId } from "../entities/DigitalId";
import { uploadImageStream } from "../verification/upload-image";
import { getEnvironmentValue, Environment } from "../environment";
import { extractText } from "../verification/extract-text";
import { Sharp } from "sharp";
import {
	AnnotationBoundingBoxExtractor,
	AnnotationType,
} from "../verification/annotation-bounding-box-extractor";
import { parseDigitalId } from "../verification/digital-id-parser";

export class VerifierResolver {
	private faceExtractor: AnnotationBoundingBoxExtractor;
	private logoExtractor: AnnotationBoundingBoxExtractor;

	constructor() {
		this.faceExtractor = new AnnotationBoundingBoxExtractor(
			AnnotationType.FACE
		);
		this.logoExtractor = new AnnotationBoundingBoxExtractor(
			AnnotationType.LOGO
		);
	}

	@Mutation(() => DigitalId)
	async uploadId(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename }: FileUpload
	): Promise<DigitalId> {
		const annotations = await annotateImage(createReadStream());
		const faceStream = this.faceExtractor.extract(
			createReadStream(),
			annotations
		);
		const logoStream = this.logoExtractor.extract(
			createReadStream(),
			annotations
		);
		await Promise.all([
			this.uploadFileToS3(createReadStream(), `uploads/${filename}`),
			this.uploadFileToS3(faceStream, `face/${filename}`),
			this.uploadFileToS3(logoStream, `logo/${filename}`),
		]);
		const id = parseDigitalId(filename, extractText(annotations));
		await id.save();
		return id;
	}

	private uploadFileToS3(stream: ReadStream | Sharp, key: string) {
		const bucketName = getEnvironmentValue(
			Environment.VERIFICATION_IMAGES_BUCKET
		);
		const { passThrough, upload } = uploadImageStream(bucketName, key);
		stream.pipe(passThrough);
		return upload.done();
	}
}
