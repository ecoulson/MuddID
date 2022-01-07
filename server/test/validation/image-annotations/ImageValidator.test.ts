import BufferedFile from "../../../src/models/common/files/BufferedFile";
import IllegalFileException from "../../../src/models/common/files/exceptions/IllegalFileException";
import ImageValidator from "../../../src/validations/image-annotations/ImageValidator";

describe("Image Validator Suite", () => {
	const validator = new ImageValidator();

	test("When given an empty buffer it should throw", () => {
		const content = Buffer.from("");
		const file = new BufferedFile("285d1782-5e96-4b2f-a113-97ea9a82debf.jpg", content);
		const expectedErrorData = new Map([
			["content", ["File content can not be an empty buffer"]],
		]);
		const expectedException = new IllegalFileException(expectedErrorData);

		expect(() => {
			validator.validate(file);
		}).toBeSameException(expectedException);
	});

	test("When given an file with an illegal extension it should throw", () => {
		const content = Buffer.from("content");
		const file = new BufferedFile("285d1782-5e96-4b2f-a113-97ea9a82debf.svg", content);
		const expectedErrorData = new Map([
			["extension", ["Extension must be one of the following types: .jpg, .jpeg, .png"]],
		]);
		const expectedException = new IllegalFileException(expectedErrorData);

		expect(() => {
			validator.validate(file);
		}).toThrowError(expectedException);
	});

	test("When given a file with an invalid uuid in its name it should throw", () => {
		const content = Buffer.from("content");
		const file = new BufferedFile("file.png", content);
		const expectedErrorData = new Map([["name", ["Name must be a valid UUID"]]]);
		const expectedException = new IllegalFileException(expectedErrorData);

		expect(() => {
			validator.validate(file);
		}).toThrowError(expectedException);
	});
});
