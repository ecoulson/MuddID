import sharp from "sharp";
import { instance, mock, reset, verify, when } from "ts-mockito";
import SharpImageExtractor from "../../../src/brokers/image-extractors/SharpImageExtractorBroker";
import ImageExtractorFoundationService from "../../../src/foundations/image-extractors/ImageExtractorFoundationService";
import Exception from "../../../src/models/common/exceptions/Exception";
import FileStream from "../../../src/models/common/files/FileStream";
import IllegalFileException from "../../../src/models/common/files/exceptions/IllegalFileException";
import BoundingBox from "../../../src/models/common/geometry/BoundingBox";
import ImageExtractorDependencyException from "../../../src/models/image-extractors/exceptions/ImageExtractorDependencyException";
import ImageExtractorDependencyValidationException from "../../../src/models/image-extractors/exceptions/ImageExtractorDependencyValidationException";
import ImageExtractorValidationException from "../../../src/models/image-extractors/exceptions/ImageExtractorValidationException";
import { Readable } from "typeorm/platform/PlatformTools";

describe("Image Extractor Foundation Service Suite", () => {
	const fileName = "42875faa-71ac-4de2-b232-fee667d95380.png";
	const mockedImageExtractorBroker = mock(SharpImageExtractor);
	const mockedInputReadable = mock(Readable);
	const mockedOutputReadable = mock(Readable);

	beforeEach(() => {
		reset(mockedImageExtractorBroker);
		reset(mockedInputReadable);
	});

	test("When extracting an image and it succeeds it should return a file stream", async () => {
		when(mockedInputReadable.readable).thenReturn(true);
		when(mockedOutputReadable.readable).thenReturn(true);
		const inputImage = instance(mockedInputReadable);
		const expectedImage = instance(mockedOutputReadable);
		const inputImageStream = new FileStream(fileName, inputImage);
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const expectedFileStream = new FileStream(fileName, expectedImage);

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenResolve(
			expectedImage,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		const actualFileStream = await service.extract(inputImageStream, boundingBox);

		expect(actualFileStream).toEqual(expectedFileStream);
		verify(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).once();
	});

	test("When extracting an image and the broker fails it should throw a dependency exception", async () => {
		when(mockedInputReadable.readable).thenReturn(true);
		const inputImage = instance(mockedInputReadable);
		const inputImageStream = new FileStream(fileName, inputImage);
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new Exception(Exception.name, "Extraction failed");
		const expectedException = new ImageExtractorDependencyException(innerException);

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenReject(
			innerException,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		const extractionPromise = service.extract(inputImageStream, boundingBox);

		await expect(extractionPromise).rejects.toBeSameException(expectedException);
		verify(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).once();
	});

	test("When extracting from a non readable image input stream it should throw a dependency exception", async () => {
		when(mockedInputReadable.readable).thenReturn(false);
		const inputImage = instance(mockedInputReadable);
		const inputImageStream = new FileStream(fileName, inputImage);
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new IllegalFileException(
			new Map([["content", ["Content stream must not be closed"]]]),
		);
		const expectedException = new ImageExtractorValidationException(innerException);

		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		const extractionPromise = service.extract(inputImageStream, boundingBox);

		await expect(extractionPromise).rejects.toBeSameException(expectedException);
		verify(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).never();
	});

	test("When extracted stream has problem it should throw a dependency validation exception", async () => {
		when(mockedInputReadable.readable).thenReturn(true);
		when(mockedOutputReadable.readable).thenReturn(false);
		const inputImage = instance(mockedInputReadable);
		const expectedImage = instance(mockedOutputReadable);
		const inputImageStream = new FileStream(fileName, inputImage);
		const boundingBox = new BoundingBox(0, 0, 64, 64);
		const innerException = new IllegalFileException(
			new Map([["content", ["Content stream must not be closed"]]]),
		);
		const expectedException = new ImageExtractorDependencyValidationException(innerException);

		when(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).thenResolve(
			expectedImage,
		);
		const imageExtractorBroker = instance(mockedImageExtractorBroker);
		const service = new ImageExtractorFoundationService(imageExtractorBroker);

		const extractionPromise = service.extract(inputImageStream, boundingBox);

		await expect(extractionPromise).rejects.toBeSameException(expectedException);
		verify(mockedImageExtractorBroker.extract(inputImageStream, boundingBox)).once();
	});
});
