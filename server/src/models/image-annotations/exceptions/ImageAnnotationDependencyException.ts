import Exception from "../../common/exceptions/Exception";

export default class ImageAnnotationDependencyException extends Exception {
	constructor(innerException: Error) {
		super(ImageAnnotationDependencyException.name, "", innerException);
	}
}
