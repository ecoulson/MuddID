import Exception from "../../common/exceptions/Exception";

export default class ImageExtractorValidationException extends Exception {
	constructor(innerException: Error) {
		super(ImageExtractorValidationException.name, "", innerException);
	}
}
