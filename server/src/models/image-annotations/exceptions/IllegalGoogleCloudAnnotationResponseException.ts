import Exception from "../../common/exceptions/Exception";

export default class IllegalGoogleCloudAnnotationResponseException extends Exception {
	constructor(data?: Map<string, string[]>) {
		super(IllegalGoogleCloudAnnotationResponseException.name);
		this.addData(data ?? new Map<string, string[]>());
	}
}
