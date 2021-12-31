import Exception from "../../common/exceptions/Exception";

export default class ImageAnnotationValidationException extends Exception {
	constructor(innerException: Exception) {
		super(ImageAnnotationValidationException.name, "", innerException);
	}
}
