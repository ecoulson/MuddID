import Exception from "../../exceptions/Exception";

export default class IllegalFileException extends Exception {
	constructor(data?: Map<string, string[]>) {
		super(IllegalFileException.name, "", undefined, data);
	}
}
