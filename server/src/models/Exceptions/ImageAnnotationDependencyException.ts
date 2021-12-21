import Exception from "../Exception";

export default class ImageAnnotationDependencyException extends Exception {
	constructor(innerException: Error) {
		super(ImageAnnotationDependencyException.name, "", innerException);
	}
}
