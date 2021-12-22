export default class Exception extends Error {
	public readonly innerException?: Error;
	public readonly data: Map<string, string[]>;

	constructor(
		name: string = "Exception",
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

	public throwIfContainsErrors() {
		throw this;
	}
}
