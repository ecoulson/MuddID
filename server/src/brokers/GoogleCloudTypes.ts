import { google } from "@google-cloud/vision/build/protos/protos";

export type GoogleCloudAnnotationResponse = google.cloud.vision.v1.IAnnotateImageResponse;
export type GoogleCloudAnnotation = GoogleCloudFaceAnnotation | GoogleCloudEntityAnnotation;
export type GoogleCloudFaceAnnotation = google.cloud.vision.v1.IFaceAnnotation;
export type GoogleCloudEntityAnnotation = google.cloud.vision.v1.IEntityAnnotation;
export type GoogleCloudVertex = google.cloud.vision.v1.IVertex;
export type GoogleCloudAnnotationFeature = {
	type: GoogleCloudAnnotationFeatureType;
};

export enum GoogleCloudAnnotationFeatureType {
	FACE_DETECTION = "FACE_DETECTION",
	LOGO_DETECTION = "LOGO_DETECTION",
	DOCUMENT_TEXT_DETECTION = "DOCUMENT_TEXT_DETECTION",
	CROP_HINTS = "CROP_HINTS",
}
