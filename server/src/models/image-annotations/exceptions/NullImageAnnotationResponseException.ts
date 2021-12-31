import Exception from "../../common/exceptions/Exception";

export default class NullImageAnnotationResponseException extends Exception {
	constructor() {
		super(NullImageAnnotationResponseException.name);
	}
}
