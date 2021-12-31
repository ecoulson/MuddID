import sharp from "sharp";
import { Readable } from "stream";
import { instance, mock, reset, when } from "ts-mockito";
import SharpImageExtractor from "../../../src/brokers/image-extractors/SharpImageExtractorBroker";
import ImageExtractorFoundationService from "../../../src/foundations/image-extractors/ImageExtractorFoundationService";
import Exception from "../../../src/models/common/exceptions/Exception";
import FileStream from "../../../src/models/common/files/FileStream";
import BoundingBox from "../../../src/models/common/geometry/BoundingBox";
import IllegalFileStreamException from "../../../src/models/image-extractors/exceptions/IllegalFileStreamException";
import ImageExtractorDependencyException from "../../../src/models/image-extractors/exceptions/ImageExtractorDependencyException";
import ImageExtractorDependencyValidationException from "../../../src/models/image-extractors/exceptions/ImageExtractorDependencyValidationException";
import ImageExtractorValidationException from "../../../src/models/image-extractors/exceptions/ImageExtractorValidationException";

const testImageBase64Encoded =
	"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";
const extractedImageBase64Encoded =
	"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAIVJREFUeF7t10ERACAMA0Hq3xw/VKABhNwiIUOzk7n7vBV+IwA/wAnogHAHLiVIAQpQgAIUCCeAQQxiEIMYDCNgDGEQgxjEIAYxGE4AgxjEIAYxGEbAGsQgBjGIQQxiMJwABjGIQQxiMIyANYhBDGIQgxjEYDgBDGIQgxjEYBgBaxCDdQY/RQHlAcYEFaQAAAAASUVORK5CYII=";
const fileName = "42875faa-71ac-4de2-b232-fee667d95380.png";

describe("Image Extractor Foundation Service Suite", () => {
	const mockedImageExtractorBroker = mock(SharpImageExtractor);

	beforeEach(() => {
		reset(mockedImageExtractorBroker);
	});

	test("Should extract region from image", async () => {
		const inputImage = Buffer.from(testImageBase64Encoded, "base64");
		const inputImageStream = new FileStream(fileName, Readable.from(inputImage.toString()));
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const extractedImage = Buffer.from(extractedImageBase64Encoded, "base64");
		const expectedSharpObject = sharp(extractedImage);
		const expectedFileStream = new FileStream(fileName, expectedSharpObject);

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenResolve(
			expectedSharpObject,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		const actualFileStream = await service.extract(inputImageStream, boundingBox);

		expect(actualFileStream).toEqual(expectedFileStream);
	});

	test("When extracting an image and the broker fails it should throw a dependency exception", async () => {
		const inputImage = Buffer.from(testImageBase64Encoded, "base64");
		const inputImageStream = new FileStream(fileName, Readable.from(inputImage.toString()));
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new Exception(Exception.name, "Extraction failed");
		const expectedException = new ImageExtractorDependencyException(innerException);

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenReject(
			innerException,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		try {
			expect.assertions(1);
			await service.extract(inputImageStream, boundingBox);
		} catch (error) {
			expect(error).toEqual(expectedException);
		}
	});

	test("When extracting from a non readable image input stream it should throw a dependency exception", async () => {
		const inputImage = Buffer.from("");
		const inputImageStream = new FileStream(fileName, Readable.from(inputImage.toString()));
		inputImageStream.content.destroy();
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new IllegalFileStreamException(
			new Map([["content", ["Stream must not be closed"]]]),
		);
		const expectedException = new ImageExtractorValidationException(innerException);

		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		try {
			expect.assertions(1);
			await service.extract(inputImageStream, boundingBox);
		} catch (error) {
			expect(error).toEqual(expectedException);
		}
	});

	test("When extracted stream has problem it should throw a dependency validation exception", async () => {
		const inputImage = Buffer.from(testImageBase64Encoded, "base64");
		const inputImageStream = new FileStream(fileName, Readable.from(inputImage.toString()));
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new IllegalFileStreamException(
			new Map([["content", ["Stream must not be closed"]]]),
		);
		const expectedException = new ImageExtractorDependencyValidationException(innerException);
		const extractedImage = Buffer.from(extractedImageBase64Encoded, "base64");
		const expectedSharpObject = sharp(extractedImage);
		expectedSharpObject.destroy();

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenResolve(
			expectedSharpObject,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		try {
			expect.assertions(1);
			await service.extract(inputImageStream, boundingBox);
		} catch (error) {
			expect(error).toEqual(expectedException);
		}
	});
});
