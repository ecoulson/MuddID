import Exception from "../../common/exceptions/Exception";

export default class ImageAnnotationDependencyValidationException extends Exception {
	constructor(innerException: Exception) {
		super(
			ImageAnnotationDependencyValidationException.name,
			"",
			innerException
		);
	}
}
