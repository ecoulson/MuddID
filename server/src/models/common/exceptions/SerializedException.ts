export default class SerializedException {
	constructor(
		public readonly name: string,
		public readonly message: string,
		public readonly data: Record<string, string[]>,
		public readonly innerException?: SerializedException,
	) {}
}
