import Exception from "../../common/exceptions/Exception";

export default class ImageExtractorDependencyValidationException extends Exception {
	constructor(innerException: Exception) {
		super(ImageExtractorDependencyValidationException.name, "", innerException);
	}
}
