import { GoogleCloudAnnotationResponse } from "../types/GoogleCloudTypes";

function extractText(annotations: GoogleCloudAnnotationResponse) {
	if (!annotations.textAnnotations) {
		throw new Error("No text annotations found");
	}
	if (!annotations.textAnnotations[0].description) {
		throw new Error("No description found in text annotation");
	}
	return annotations.textAnnotations[0].description;
}

export { extractText };
