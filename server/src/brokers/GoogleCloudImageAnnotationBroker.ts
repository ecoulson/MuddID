import { google } from "@google-cloud/vision/build/protos/protos";
import IGoogleCloudImageAnnotationBrokerConfiguration from "./IGoogleCloudImageAnnotationBrokerConfiguration.ts";
import IImageAnnotationBroker from "./IImageAnnotationBroker";

type GoogleCloudAnnotationResponse =
	google.cloud.vision.v1.IAnnotateImageResponse;

export default class GoogleCloudImageAnnotationBroker
	implements IImageAnnotationBroker<GoogleCloudAnnotationResponse>
{
	private configuration: IGoogleCloudImageAnnotationBrokerConfiguration;

	constructor(configuration: IGoogleCloudImageAnnotationBrokerConfiguration) {
		this.configuration = configuration;
	}

	async annotateImage(
		file: Buffer
	): Promise<GoogleCloudAnnotationResponse> {
		const { client, features } = this.configuration
		const [result] = await client.annotateImage({
			features: features,
			image: {
				content: file,
			},
		});
		return result;
	}
}
