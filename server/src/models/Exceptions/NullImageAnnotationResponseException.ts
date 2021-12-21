import Exception from "../Exception";

export default class NullImageAnnotationResponseException extends Exception {
	constructor() {
		super(NullImageAnnotationResponseException.name);
	}
}
