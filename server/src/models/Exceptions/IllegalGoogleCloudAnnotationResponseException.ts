import Exception from "../Exception";

export default class IllegalGoogleCloudAnnotationResponseException extends Exception {
	constructor(data?: Map<string, string[]>) {
		super(IllegalGoogleCloudAnnotationResponseException.name);
		this.addData(data ?? new Map<string, string[]>());
	}
}
