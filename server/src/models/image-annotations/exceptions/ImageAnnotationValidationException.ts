import Exception from "../../common/exception/Exception";

export default class ImageAnnotationValidationException extends Exception {
	constructor(innerException: Exception) {
		super(ImageAnnotationValidationException.name, "", innerException);
	}
}
