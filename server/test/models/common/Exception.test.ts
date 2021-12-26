import Exception from "../../../src/models/common/exception/Exception";

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

		try {
			expect.assertions(1);
			exception.throwIfContainsErrors();
		} catch (error) {
			expect(error).toEqual(expectedException);
		}
	});

	test("When there are no errors on the exception it should not throw", () => {
		const exception = new Exception();

		try {
			exception.throwIfContainsErrors();
		} catch (error) {
			fail("Should not throw an exception");
		}
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
});
