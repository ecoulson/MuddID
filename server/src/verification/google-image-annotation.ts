import { google } from "@google-cloud/vision/build/protos/protos";

export type GoogleImageAnnotation =
	google.cloud.vision.v1.IAnnotateImageResponse;
