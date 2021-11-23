import { IdQuery } from "../generated/graphql";

export default class ImageVerificationDTO {
	public feature: string;
	public width: number;
	public height: number;
	public prompt: string;
	public type: string;

	private data: IdQuery;

	constructor(
		feature: string,
		size: [number, number],
		prompt: string,
		data: IdQuery
	) {
		this.type = "IMAGE_VERIFICATION";
		this.width = size[0];
		this.height = size[1];
		this.prompt = prompt;
		this.feature = feature;
		this.data = data;
	}

	url() {
		return `http://localhost:4000/aws/mudd-id-verification-images?key=${this.feature}/${this.data.id.uploadFilename}`;
	}
}
