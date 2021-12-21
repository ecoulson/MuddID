import { google } from "@google-cloud/vision/build/protos/protos";
import AnnotatedImage from "../models/AnnotatedImage";

type GoogleCloudAnnotationResponse =
	google.cloud.vision.v1.IAnnotateImageResponse;

export default class GoogleCloudAnnotationResponseMapper {
	mapToAnnotatedImage(
		response: GoogleCloudAnnotationResponse
	): AnnotatedImage {
		throw new Error();
	}
}
