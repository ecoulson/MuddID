import { ImageAnnotatorClient } from "@google-cloud/vision/build/src/v1";
import { GoogleCloudAnnotationFeature } from "./GoogleCloudAnnotationFeature";

export default interface IGoogleCloudImageAnnotationBrokerConfiguration {
	features: GoogleCloudAnnotationFeature[];
	client: ImageAnnotatorClient;
}
