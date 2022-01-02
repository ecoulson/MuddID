import GoogleCloudImageAnnotationBroker from "../../../src/brokers/image-annotations/GoogleCloudImageAnnotationBroker";
import ImageAnnotationFoundationService from "../../../src/foundations/image-annotations/ImageAnnotationFoundationService";
import AnnotatedImage from "../../../src/models/image-annotations/AnnotatedImage";
import { instance, mock, reset, verify, when } from "ts-mockito";
import {
	createExpectedAnnotatedImageFromResponse,
	createFakeGoogleCloudAnnotationResponse,
} from "../../fakes/FakeGoogleCloudAnnotationResponse";
import ImageAnnotationValidationException from "../../../src/models/image-annotations/exceptions/ImageAnnotationValidationException";
import ImageAnnotationDependencyException from "../../../src/models/image-annotations/exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../../../src/models/image-annotations/exceptions/ImageAnnotationDependencyValidationException";
import NullImageAnnotationResponseException from "../../../src/models/image-annotations/exceptions/NullImageAnnotationResponseException";
import IllegalBufferedAnnotationImage from "../../../src/models/image-annotations/exceptions/IllegalBufferedAnnotationImage";
import BufferedFile from "../../../src/models/common/files/BufferedFile";

describe("Image Annotation Foundation Service Tests", () => {
	const mockedAnnotationBroker = mock(GoogleCloudImageAnnotationBroker);
	const name = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.jpg";

	beforeEach(() => {
		reset(mockedAnnotationBroker);
	});

	test("Should annotate image with requested features", async () => {
		const file = new BufferedFile(name, Buffer.from("file content"));
		const response = createFakeGoogleCloudAnnotationResponse();

		when(mockedAnnotationBroker.annotateImage(file)).thenResolve(response);
		const expectedAnnotatedImage = createExpectedAnnotatedImageFromResponse(file, response);

		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		const actualAnnotatedImage = await imageAnnotationFoundationService.annotateImage(file);

		expect(actualAnnotatedImage).toEqual<AnnotatedImage>(expectedAnnotatedImage);
		verify(mockedAnnotationBroker.annotateImage(file)).called();
	});

	test("Should throw a validation exception for an empty file", async () => {
		const file = new BufferedFile(name, Buffer.from(""));
		const expectedErrorData = new Map([
			["content", ["File content can not be an empty buffer"]],
		]);
		const expectedException = new ImageAnnotationValidationException(
			new IllegalBufferedAnnotationImage(expectedErrorData),
		);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		const annotationPromise = imageAnnotationFoundationService.annotateImage(file);

		await expect(annotationPromise).rejects.toBeSameException(expectedException);
		verify(mockedAnnotationBroker.annotateImage(file)).never();
	});

	test("Should throw a dependency exception when the broker throws", async () => {
		const file = new BufferedFile(name, Buffer.from("content"));
		const brokerException = new Error("Failed to making call to GCP api");
		const expectedException = new ImageAnnotationDependencyException(brokerException);

		when(mockedAnnotationBroker.annotateImage(file)).thenThrow(brokerException);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		const annotationPromise = imageAnnotationFoundationService.annotateImage(file);

		await expect(annotationPromise).rejects.toBeSameException(expectedException);
		verify(mockedAnnotationBroker.annotateImage(file)).once();
	});

	test("Should throw a dependency validation exception when response is undefined", async () => {
		const file = new BufferedFile(name, Buffer.from("content"));
		const validationException = new NullImageAnnotationResponseException();
		const expectedException = new ImageAnnotationDependencyValidationException(
			validationException,
		);

		when(mockedAnnotationBroker.annotateImage(file)).thenResolve(undefined as any);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		const annotationPromise = imageAnnotationFoundationService.annotateImage(file);

		await expect(annotationPromise).rejects.toBeSameException(expectedException);
		verify(mockedAnnotationBroker.annotateImage(file)).once();
	});
});
