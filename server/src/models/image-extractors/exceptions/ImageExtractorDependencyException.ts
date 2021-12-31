import Exception from "../../common/exceptions/Exception";

export default class ImageExtractorDependencyException extends Exception {
	constructor(innerException: Exception) {
		super(ImageExtractorDependencyException.name, "", innerException);
	}
}
