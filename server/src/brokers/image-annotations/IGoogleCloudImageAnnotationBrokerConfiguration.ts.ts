import { ImageAnnotatorClient } from "@google-cloud/vision/build/src/v1";
import { GoogleCloudAnnotationFeature } from "../../types/GoogleCloudTypes";

export default interface IGoogleCloudImageAnnotationBrokerConfiguration {
	features: GoogleCloudAnnotationFeature[];
	client: ImageAnnotatorClient;
}
