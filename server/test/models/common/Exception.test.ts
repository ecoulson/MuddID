import Exception from "../../../src/models/common/exceptions/Exception";
import SerializedException from "../../../src/models/common/exceptions/SerializedException";

describe("Exception Suite", () => {
	test("When upserting into empty key it should add it to the list", () => {
		const exception = new Exception();
		const key = "id";
		const value = "id can not be null";
		const expectedValues = [value];

		exception.upsertDataList(key, value);

		expect(exception.data.get(key)).toEqual(expectedValues);
	});

	test("When upserting into existing key it should add it to the existing list", () => {
		const key = "id";
		const existingValue = "id is invalid";
		const newValue = "id must be a UUID";
		const exception = new Exception(
			Exception.name,
			"",
			undefined,
			new Map([[key, [existingValue]]]),
		);
		const expectedValues = [existingValue, newValue];

		exception.upsertDataList(key, newValue);

		expect(exception.data.get(key)).toEqual(expectedValues);
	});

	test("When there are errors in the exception it should throw", () => {
		const exception = new Exception(
			Exception.name,
			"",
			undefined,
			new Map([["id", ["error"]]]),
		);
		const expectedException = exception;

		expect(() => {
			exception.throwIfContainsErrors();
		}).toBeSameException(expectedException);
	});

	test("When there are no errors on the exception it should not throw", () => {
		const exception = new Exception();

		expect(() => {
			exception.throwIfContainsErrors();
		}).not.toThrow();
	});

	test("When adding data to the exception it should add the data", () => {
		const data = new Map([["key", ["value"]]]);
		const exception = new Exception();
		const expectedException = new Exception(Exception.name, "", undefined, data);

		exception.addData(data);

		expect(exception.data).toEqual(expectedException.data);
	});

	test("When adding data to the exception it should not overwrite the data", () => {
		const newData = new Map([["key", ["value"]]]);
		const existingData = new Map([["key", ["old error"]]]);
		const expectedData = new Map([["key", ["old error", "value"]]]);
		const exception = new Exception(Exception.name, "", undefined, existingData);
		const expectedException = new Exception(Exception.name, "", undefined, expectedData);

		exception.addData(newData);

		expect(exception.data).toEqual(expectedException.data);
	});

	test("When serializing an exception it should have the correct name, message and data", () => {
		const exception = new Exception(
			Exception.name,
			"message",
			undefined,
			new Map([["hello", ["world"]]]),
		);
		const expectedSerialization = new SerializedException("Exception", "message", {
			hello: ["world"],
		});

		const actualSerialization = exception.serialize();

		expect(actualSerialization).toEqual(expectedSerialization);
	});

	test("When serializing an exception it should have the correct name, message, data, and inner exception", () => {
		const innerException = new Exception(
			"Exception",
			"inner",
			undefined,
			new Map([["nested", ["hello world"]]]),
		);
		const exception = new Exception(
			Exception.name,
			"message",
			innerException,
			new Map([["hello", ["world"]]]),
		);
		const innerSerialization = new SerializedException("Exception", "inner", {
			nested: ["hello world"],
		});
		const expectedSerialization = new SerializedException(
			"Exception",
			"message",
			{
				hello: ["world"],
			},
			innerSerialization,
		);

		const actualSerialization = exception.serialize();

		expect(actualSerialization).toEqual(expectedSerialization);
	});

	test("When serializing an exception it should handle inner exceptions with type of Error", () => {
		const innerException = new Error("Exception");
		const exception = new Exception(
			Exception.name,
			"message",
			innerException,
			new Map([["hello", ["world"]]]),
		);
		const innerSerialization = new SerializedException("Error", "Exception", {});
		const expectedSerialization = new SerializedException(
			"Exception",
			"message",
			{
				hello: ["world"],
			},
			innerSerialization,
		);

		const actualSerialization = exception.serialize();

		expect(actualSerialization).toEqual(expectedSerialization);
	});
});
