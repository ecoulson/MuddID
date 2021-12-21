import { GoogleCloudAnnotationResponse } from "../../src/brokers/GoogleCloudTypes";
import AnnotatedImage from "../../src/models/AnnotatedImage";
import BoundingBox from "../../src/models/BoundingBox";
import TextAnnotation from "../../src/models/TextAnnotation";
import Vertex from "../../src/models/Vertex";

export function createFakeGoogleCloudAnnotationResponse(): GoogleCloudAnnotationResponse {
	return {
		faceAnnotations: [
			{
				boundingPoly: {
					vertices: [
						{
							x: 100,
							y: 20,
						},
					],
				},
			},
		],
		logoAnnotations: [
			{
				boundingPoly: {
					vertices: [
						{
							x: 400,
							y: 220,
						},
					],
				},
			},
		],
		textAnnotations: [
			{
				description: "Some text",
			},
		],
	};
}

export function createExpectedAnnotatedImageFromResponse(
	file: Buffer,
	response: GoogleCloudAnnotationResponse,
): AnnotatedImage {
	return new AnnotatedImage(
		file,
		[
			new BoundingBox(
				response.faceAnnotations![0].boundingPoly!.vertices!.map(
					({ x, y }) => new Vertex(x!, y!),
				),
			),
		],
		[
			new BoundingBox(
				response.logoAnnotations![0].boundingPoly!.vertices!.map(
					({ x, y }) => new Vertex(x!, y!),
				),
			),
		],
		[new TextAnnotation(response.textAnnotations![0].description!)],
	);
}
