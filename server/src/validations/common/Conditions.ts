export function isNil<T>(x: T | null | undefined): x is null | undefined {
	return x === null || x === undefined;
}
