import { GoogleCloudAnnotationResponse } from "../../src/brokers/GoogleCloudTypes";
import BufferedFile from "../../src/models/common/files/BufferedFile";
import AnnotatedImage from "../../src/models/image-annotations/AnnotatedImage";
import BoundingBox from "../../src/models/image-annotations/BoundingBox";
import TextAnnotation from "../../src/models/image-annotations/TextAnnotation";
import Vertex from "../../src/models/image-annotations/Vertex";

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
	{ content }: BufferedFile,
	response: GoogleCloudAnnotationResponse,
): AnnotatedImage {
	return new AnnotatedImage(
		content,
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
