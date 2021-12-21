import { google } from "@google-cloud/vision/build/protos/protos";
import GoogleCloudAnnotationResponseMapper from "../../src/mappers/GoogleCloudAnnotationResponseMapper";
import AnnotatedImage from "../../src/models/AnnotatedImage";
import BoundingBox from "../../src/models/BoundingBox";
import TextAnnotation from "../../src/models/TextAnnotation";
import {
	createExpectedAnnotatedImageFromResponse,
	createFakeGoogleCloudAnnotationResponse,
} from "../fakes/FakeGoogleCloudAnnotationResponse";

type GoogleCloudAnnotationResponse = google.cloud.vision.v1.IAnnotateImageResponse;

describe("Google Cloud Annotation Response Mapper Suite", () => {
	const mapper = new GoogleCloudAnnotationResponseMapper();
	const file = Buffer.from("");

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
		const expectedAnnotatedImage = new AnnotatedImage(file);

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
		const expectedAnnotatedImage = new AnnotatedImage(file, [new BoundingBox([])]);

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
		const expectedAnnotatedImage = new AnnotatedImage(file, [new BoundingBox([])]);

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
		const expectedAnnotatedImage = new AnnotatedImage(file, [new BoundingBox([])]);

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
		const expectedAnnotatedImage = new AnnotatedImage(file, [], [], [new TextAnnotation("")]);

		const actualAnnotatedImage = mapper.mapToAnnotatedImage(file, inputResponse);

		expect(actualAnnotatedImage).toEqual(expectedAnnotatedImage);
	});
});
