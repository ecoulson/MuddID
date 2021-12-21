export default class Exception extends Error {
	public readonly innerException?: Error;

	constructor(name: string, message: string = "", innerException?: Error) {
		super();
		this.innerException = innerException;
		this.name = name;
		this.message = message;
	}
}
