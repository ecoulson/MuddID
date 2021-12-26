import Exception from "../../common/exception/Exception";

export default class ImageAnnotationDependencyValidationException extends Exception {
	constructor(innerException: Exception) {
		super(
			ImageAnnotationDependencyValidationException.name,
			"",
			innerException
		);
	}
}
