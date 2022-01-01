import SerializedException from "./SerializedException";

export default class Exception extends Error {
	public readonly innerException?: Error;
	public readonly data: Map<string, string[]>;

	constructor(
		name: string = Exception.name,
		message: string = "",
		innerException: Error | undefined = undefined,
		data: Map<string, string[]> = new Map<string, string[]>(),
	) {
		super();
		this.innerException = innerException;
		this.name = name;
		this.message = message;
		this.data = data;
	}

	public upsertDataList(key: string, value: string): void {
		if (!this.data.has(key)) {
			this.data.set(key, [value]);
		} else {
			this.data.get(key)!.push(value);
		}
	}

	public addData(data: Map<string, string[]>) {
		for (const [parameter, errors] of data) {
			for (const error of errors) {
				this.upsertDataList(parameter, error);
			}
		}
	}

	public throwIfContainsErrors() {
		if (this.data.size > 0) {
			throw this;
		}
	}

	public serialize(): SerializedException {
		if (!this.innerException) {
			return new SerializedException(this.name, this.message, this.convertMapToObject());
		}
		if (this.innerException instanceof Exception) {
			return new SerializedException(
				this.name,
				this.message,
				this.convertMapToObject(),
				this.innerException.serialize(),
			);
		} else {
			return new SerializedException(
				this.name,
				this.message,
				this.convertMapToObject(),
				new SerializedException(this.innerException.name, this.innerException.message, {}),
			);
		}
	}

	private convertMapToObject(): Record<string, string[]> {
		const record: Record<string, string[]> = {};
		for (let [parameter, errors] of this.data) {
			record[parameter] = errors;
		}
		return record;
	}
}
