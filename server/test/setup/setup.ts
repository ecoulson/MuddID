import Exception from "../../src/models/common/exceptions/Exception";
import { isNil } from "../../src/validations/common/Conditions";
import { diff } from "jest-diff";

type Errorish = Exception | Error | undefined | null;

expect.extend({
	toBeSameException(received, expected) {
		let receivedException = received;
		if (typeof received === "function") {
			try {
				received();
				return {
					pass: false,
					message: () => `expected function to throw an exception`,
				};
			} catch (error) {
				receivedException = error;
			}
		}
		if (!isException(receivedException)) {
			return {
				pass: false,
				message: () => `expected ${receivedException} to be an instance of an Exception`,
			};
		}
		if (!isException(expected)) {
			return {
				pass: false,
				message: () => `${expected} must be an instance of an Exception`,
			};
		}
		const pass = isSameException(receivedException, expected);
		const serializedReceived = receivedException.serialize();
		const serializedExpected = expected.serialize();

		if (!pass) {
			return {
				pass,
				message: () => diff(serializedExpected, serializedReceived) ?? "",
			};
		} else {
			return {
				pass,
				message: () =>
					"Expected the received exception to be the same as the expected exception",
			};
		}
	},
});

const isException = (exception: unknown): exception is Exception => exception instanceof Exception;

const isError = (error: unknown): error is Error => error instanceof Error;

const isSameException = (a: Errorish, b: Errorish): boolean => {
	if (isNil(a) && isNil(b)) {
		return true;
	} else if (isNil(a) || isNil(b)) {
		return false;
	} else if (isException(a) && isException(b)) {
		return (
			isSameName(a, b) &&
			isSameMessage(a, b) &&
			isSameException(a.innerException, b.innerException) &&
			isSameData(a, b)
		);
	} else if (isException(a) || isException(b)) {
		return false;
	} else if (isError(a) && isError(b)) {
		return a.message === b.message;
	} else {
		return false;
	}
};

const isSameName = (a: Exception, b: Exception) => a.name === b.name;

const isSameMessage = (a: Exception, b: Exception) => a.message === b.message;

const isSameData = (a: Exception, b: Exception) => {
	if (a.data.size !== b.data.size) {
		return false;
	}
	for (let [parameter, expectedErrors] of a.data) {
		if (!b.data.has(parameter)) {
			return false;
		}
		const errors = b.data.get(parameter)!;
		const haveSameErrors = isArrayEquivalent(expectedErrors, errors);
		if (!haveSameErrors) {
			return false;
		}
	}
	return true;
};

const isArrayEquivalent = (a: string[], b: string[]) =>
	a.length === b.length && a.every((val, index) => val === b[index]);
