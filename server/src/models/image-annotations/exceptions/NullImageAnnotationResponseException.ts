import Exception from "../../common/exception/Exception";

export default class NullImageAnnotationResponseException extends Exception {
	constructor() {
		super(NullImageAnnotationResponseException.name);
	}
}
