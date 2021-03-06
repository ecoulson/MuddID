import { ReadStream } from "fs";
import sharp from "sharp";
import { GoogleCloudAnnotationResponse } from "../types/GoogleCloudTypes";
import { BoundingBox, BoundingBoxBuilder } from "./bounding-box";

export enum AnnotationType {
	FACE = "faceAnnotations",
	LOGO = "logoAnnotations",
}

export class AnnotationBoundingBoxExtractor {
	private annotationType: AnnotationType;

	constructor(annotationType: AnnotationType) {
		this.annotationType = annotationType;
	}

	public extract(stream: ReadStream, annotations: GoogleCloudAnnotationResponse) {
		const boundingBoxBuilder = new BoundingBoxBuilder();
		const verticies = this.getVerticiesFromAnnotation(annotations);
		verticies.forEach((vertex) => boundingBoxBuilder.addVertex(vertex));
		return stream.pipe(this.extractBoundingBox(boundingBoxBuilder.build()));
	}

	private getVerticiesFromAnnotation(annotations: GoogleCloudAnnotationResponse) {
		if (!annotations[this.annotationType]) {
			throw new Error("Face not found in image");
		}
		if (!annotations[this.annotationType]![0].boundingPoly) {
			throw new Error("Bounding poly does not exist in face annotation");
		}
		if (!annotations[this.annotationType]![0].boundingPoly!.vertices) {
			throw new Error("No verticies found in bounding poly");
		}
		return annotations[this.annotationType]![0].boundingPoly!.vertices!;
	}

	private extractBoundingBox(boundingBox: BoundingBox) {
		return sharp().extract(boundingBox);
	}
}
