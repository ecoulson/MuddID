import GoogleCloudImageAnnotationBroker from "../../src/brokers/GoogleCloudImageAnnotationBroker";
import ImageAnnotationFoundationService from "../../src/foundations/ImageAnnotationFoundationService";
import AnnotatedImage from "../../src/models/AnnotatedImage";
import { instance, mock, verify, when } from "ts-mockito";
import {
	createExpectedAnnotatedImageFromResponse,
	createFakeGoogleCloudAnnotationResponse,
} from "../fakes/FakeGoogleCloudAnnotationResponse";
import ImageAnnotationValidationException from "../../src/models/Exceptions/ImageAnnotationValidationException";
import ImageAnnotationDependencyException from "../../src/models/Exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../../src/models/Exceptions/ImageAnnotationDependencyValidationException";
import EmptyAnnotationImageException from "../../src/models/Exceptions/EmptyAnnotationImageException";
import NullImageAnnotationResponseException from "../../src/models/Exceptions/NullImageAnnotationResponseException";

const mockedAnnotationBroker = mock(GoogleCloudImageAnnotationBroker);

describe("Image Annotation Foundation Service Tests", () => {
	test("Should annotate image with requested features", async () => {
		const file = Buffer.from("file content");
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
		const file = Buffer.from("");
		const expectedException = new ImageAnnotationValidationException(
			new EmptyAnnotationImageException(),
		);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		try {
			expect.assertions(1);
			await imageAnnotationFoundationService.annotateImage(file);
		} catch (error) {
			expect(error).toEqual(expectedException);
			verify(mockedAnnotationBroker.annotateImage(file)).never();
		}
	});

	test("Should throw a dependency exception when the broker throws", async () => {
		const file = Buffer.from("content");
		const brokerException = new Error("Failed to making call to GCP api");
		const expectedException = new ImageAnnotationDependencyException(brokerException);

		when(mockedAnnotationBroker.annotateImage(file)).thenThrow(brokerException);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		try {
			expect.assertions(1);
			await imageAnnotationFoundationService.annotateImage(file);
		} catch (error) {
			expect(error).toEqual(expectedException);
			verify(mockedAnnotationBroker.annotateImage(file)).once();
		}
	});

	test("Should throw a dependency validation exception when response is undefined", async () => {
		const file = Buffer.from("content");
		const validationException = new NullImageAnnotationResponseException();
		const expectedException = new ImageAnnotationDependencyValidationException(
			validationException,
		);

		when(mockedAnnotationBroker.annotateImage(file)).thenResolve(undefined as any);
		const annotationBroker = instance(mockedAnnotationBroker);
		const imageAnnotationFoundationService = new ImageAnnotationFoundationService(
			annotationBroker,
		);

		expect.assertions(1);
		try {
			await imageAnnotationFoundationService.annotateImage(file);
		} catch (error) {
			expect(error).toEqual(expectedException);
			verify(mockedAnnotationBroker.annotateImage(file)).once();
		}
	});
});
