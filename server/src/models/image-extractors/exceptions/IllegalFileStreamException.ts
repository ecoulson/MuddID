import Exception from "../../common/exceptions/Exception";

export default class IllegalFileStreamException extends Exception {
	constructor(data?: Map<string, string[]>) {
		super(IllegalFileStreamException.name, "", undefined, data);
	}
}
