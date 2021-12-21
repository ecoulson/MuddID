import Exception from "../Exception";

export default class ImageAnnotationDependencyValidationException extends Exception {
	constructor(innerException: Exception) {
		super(
			ImageAnnotationDependencyValidationException.name,
			"",
			innerException
		);
	}
}
