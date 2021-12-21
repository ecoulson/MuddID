import Exception from "../Exception";

export default class EmptyAnnotationImageException extends Exception {
	constructor() {
		super(EmptyAnnotationImageException.name);
	}
}
