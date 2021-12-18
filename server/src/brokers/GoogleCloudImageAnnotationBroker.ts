import { google } from "@google-cloud/vision/build/protos/protos";
import { ImageAnnotatorClient } from "@google-cloud/vision/build/src/v1";
import { GoogleCloudAnnotationFeature } from "./GoogleCloudAnnotationFeature";
import IImageAnnotationBroker from "./IImageAnnotationBroker";

type GoogleCloudAnnotationResponse =
	google.cloud.vision.v1.IAnnotateImageResponse;

export default class GoogleCloudImageAnnotationBroker
	implements IImageAnnotationBroker<GoogleCloudAnnotationResponse>
{
	private googleCloudImageAnnotationClient: ImageAnnotatorClient;
	private features: GoogleCloudAnnotationFeature[];

	constructor(
		googleCloudImageAnnotationClient: ImageAnnotatorClient,
		features: GoogleCloudAnnotationFeature[]
	) {
		this.googleCloudImageAnnotationClient =
			googleCloudImageAnnotationClient;
        this.features = features
	}

	async annotateImageWithFeatures(
		file: Buffer
	): Promise<GoogleCloudAnnotationResponse> {
		const [result] =
			await this.googleCloudImageAnnotationClient.annotateImage({
				features: this.features,
				image: {
					content: file,
				},
			});
		return result;
	}
}
