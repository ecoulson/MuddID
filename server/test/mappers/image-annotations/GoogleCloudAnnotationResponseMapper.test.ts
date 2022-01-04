import GoogleCloudAnnotationResponseMapper from "../../../src/mappers/image-annotations/GoogleCloudAnnotationResponseMapper";
import BufferedFile from "../../../src/models/common/files/BufferedFile";
import AnnotatedImage from "../../../src/models/image-annotations/AnnotatedImage";
import BoundingPolygon from "../../../src/models/common/geometry/BoundingPolygon";
import TextAnnotation from "../../../src/models/image-annotations/TextAnnotation";
import {
	createExpectedAnnotatedImageFromResponse,
	createFakeGoogleCloudAnnotationResponse,
} from "../../fakes/FakeGoogleCloudAnnotationResponse";
import { GoogleCloudAnnotationResponse } from "../../../src/types/GoogleCloudTypes";

describe("Google Cloud Annotation Response Mapper Suite", () => {
	const mapper = new GoogleCloudAnnotationResponseMapper();
	const file = new BufferedFile("file.jpg", Buffer.from(""));

	test("When mapping a validated response it should return an annotated image", () => {
		const inputResponse = createFakeGoogleCloudAnnotationResponse();
		const expectedAnnotatedImage = createExpectedAnnotatedImageFromResponse(
			file,
			inputResponse,
		);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});

	test("When mapping a null bounding box annotation should be an empty array", () => {
		const inputResponse: GoogleCloudAnnotationResponse = {};
		const expectedAnnotatedImage = new AnnotatedImage(file.content);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});

	test("When mapping an annotation to bounding boxes with null poly it should give back an empty bounding box", () => {
		const inputResponse: GoogleCloudAnnotationResponse = {
			faceAnnotations: [
				{
					boundingPoly: null,
				},
			],
		};
		const expectedAnnotatedImage = new AnnotatedImage(file.content, [new BoundingPolygon([])]);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});

	test("When mapping an annotation to bounding boxes with null vertices it should give back an empty bounding box", () => {
		const inputResponse: GoogleCloudAnnotationResponse = {
			faceAnnotations: [
				{
					boundingPoly: {
						vertices: null,
					},
				},
			],
		};
		const expectedAnnotatedImage = new AnnotatedImage(file.content, [new BoundingPolygon([])]);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});

	test("When mapping to an annotation with a malformed vertex it should filter that vertex from the bounding box", () => {
		const inputResponse: GoogleCloudAnnotationResponse = {
			faceAnnotations: [
				{
					boundingPoly: {
						vertices: [
							{
								x: 0,
							},
						],
					},
				},
			],
		};
		const expectedAnnotatedImage = new AnnotatedImage(file.content, [new BoundingPolygon([])]);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});

	test("When mapping a text annotation with no description it should be an empty annotation", () => {
		const inputResponse: GoogleCloudAnnotationResponse = {
			textAnnotations: [
				{
					description: null,
				},
			],
		};
		const expectedAnnotatedImage = new AnnotatedImage(
			file.content,
			[],
			[],
			[new TextAnnotation("")],
		);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});
});
