import Exception from "../Exception";

export default class ImageAnnotationValidationException extends Exception {
	constructor(innerException: Exception) {
		super(ImageAnnotationValidationException.name, "", innerException);
	}
}
