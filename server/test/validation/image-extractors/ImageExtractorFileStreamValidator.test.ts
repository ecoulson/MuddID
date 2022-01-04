import { Readable } from "stream";
import { instance, mock, when } from "ts-mockito";
import FileStream from "../../../src/models/common/files/FileStream";
import IllegalFileStreamException from "../../../src/models/image-extractors/exceptions/IllegalFileStreamException";
import ImageExtractorFileStreamValidator from "../../../src/validations/image-extrators/ImageExtractorFileStreamValidator";

describe("Image Extractor File Stream Validator", () => {
	const validator = new ImageExtractorFileStreamValidator();
	const uuid = "b82dbf17-9eee-47f7-8858-bb4fe54c50a8";
	const mockedReadable = mock(Readable);

	test("When validating an illegal file name it should throw an illegal file stream exception", () => {
		when(mockedReadable.readable).thenReturn(true);
		const inputStream = instance(mockedReadable);
		const inputFileStream = new FileStream("image.png", inputStream);
		const expectedValidationErrors = new Map([["name", ["Name is an invalid UUID"]]]);
		const expectedException = new IllegalFileStreamException(expectedValidationErrors);
		expect(() => {
			validator.validate(inputFileStream);
		}).toBeSameException(expectedException);
	});

	test("When validating an illegal extension it should throw an illegal file stream exception", () => {
		when(mockedReadable.readable).thenReturn(true);
		const fileName = `${uuid}.bmp`;
		const inputStream = instance(mockedReadable);
		const inputFileStream = new FileStream(fileName, inputStream);
		const expectedValidationErrors = new Map([
			["extension", ["Image extension must be a .jpg, .jpeg, or .png"]],
		]);
		const expectedException = new IllegalFileStreamException(expectedValidationErrors);

		expect(() => {
			validator.validate(inputFileStream);
		}).toBeSameException(expectedException);
	});

	test("When validating a file stream that has been destroyed it should throw an exception", () => {
		when(mockedReadable.readable).thenReturn(false);
		const fileName = `${uuid}.png`;
		const inputStream = instance(mockedReadable);
		const inputFileStream = new FileStream(fileName, inputStream);
		const expectedValidationErrors = new Map([
			["content", ["Content stream must not be closed"]],
		]);
		const expectedException = new IllegalFileStreamException(expectedValidationErrors);

		expect(() => {
			validator.validate(inputFileStream);
		}).toBeSameException(expectedException);
	});

	test("When validating a file stream that has been destroyed it should throw an exception", () => {
		when(mockedReadable.readable).thenReturn(true);
		when(mockedReadable.readableDidRead).thenReturn(true);
		const fileName = `${uuid}.png`;
		const inputStream = instance(mockedReadable);
		const inputFileStream = new FileStream(fileName, inputStream);
		const expectedValidationErrors = new Map([
			["content", ["Content stream must not have emitted a data event or been read"]],
		]);
		const expectedException = new IllegalFileStreamException(expectedValidationErrors);

		expect(() => {
			validator.validate(inputFileStream);
		}).toBeSameException(expectedException);
	});
});
