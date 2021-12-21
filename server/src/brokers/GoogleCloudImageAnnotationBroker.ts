import { GoogleCloudAnnotationResponse } from "./GoogleCloudTypes";
import IGoogleCloudImageAnnotationBrokerConfiguration from "./IGoogleCloudImageAnnotationBrokerConfiguration.ts";
import IImageAnnotationBroker from "./IImageAnnotationBroker";

export default class GoogleCloudImageAnnotationBroker
	implements IImageAnnotationBroker<GoogleCloudAnnotationResponse>
{
	private configuration: IGoogleCloudImageAnnotationBrokerConfiguration;

	constructor(configuration: IGoogleCloudImageAnnotationBrokerConfiguration) {
		this.configuration = configuration;
	}

	async annotateImage(file: Buffer): Promise<GoogleCloudAnnotationResponse> {
		const { client, features } = this.configuration;
		const [result] = await client.annotateImage({
			features: features,
			image: {
				content: file,
			},
		});
		return result;
	}
}
