import { google } from "@google-cloud/vision/build/protos/protos";
import AnnotatedImage from "../../src/models/AnnotatedImage";
import FaceAnnotation from "../../src/models/FaceAnnotation";
import LogoAnnotation from "../../src/models/LogoAnnotation";
import TextAnnotation from "../../src/models/TextAnnotation";
import Vertex from "../../src/models/Vertex";

type GoogleCloudAnnotationResponse =
	google.cloud.vision.v1.IAnnotateImageResponse;

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
	response: GoogleCloudAnnotationResponse
): AnnotatedImage {
	return new AnnotatedImage(
		file,
		[
			new FaceAnnotation(
				response.faceAnnotations![0].boundingPoly!.vertices!.map(
					({ x, y }) => new Vertex(x!, y!)
				)
			),
		],
		[
			new LogoAnnotation(
				response.logoAnnotations![0].boundingPoly!.vertices!.map(
					({ x, y }) => new Vertex(x!, y!)
				)
			),
		],
		[new TextAnnotation(response.textAnnotations![0].description!)]
	);
}
