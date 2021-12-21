import {
	GoogleCloudAnnotation,
	GoogleCloudAnnotationResponse,
	GoogleCloudEntityAnnotation,
	GoogleCloudVertex,
} from "../brokers/GoogleCloudTypes";
import AnnotatedImage from "../models/AnnotatedImage";
import BoundingBox from "../models/BoundingBox";
import TextAnnotation from "../models/TextAnnotation";
import Vertex from "../models/Vertex";

export default class GoogleCloudAnnotationResponseMapper {
	mapToAnnotatedImage(file: Buffer, response: GoogleCloudAnnotationResponse): AnnotatedImage {
		return new AnnotatedImage(
			file,
			this.mapToBoundingBoxes(response.faceAnnotations),
			this.mapToBoundingBoxes(response.logoAnnotations),
			this.mapToTextAnnotations(response),
		);
	}

	private mapToBoundingBoxes(
		annotations: GoogleCloudAnnotation[] | null | undefined,
	): BoundingBox[] {
		if (!annotations) {
			return [];
		}
		return annotations.map((annotation) => this.mapToBoundingBox(annotation));
	}

	private mapToBoundingBox(annotation: GoogleCloudAnnotation): BoundingBox {
		if (!annotation.boundingPoly || !annotation.boundingPoly.vertices) {
			return new BoundingBox([]);
		}
		return new BoundingBox(this.mapAndFilterVertices(annotation));
	}

	private mapAndFilterVertices(annotation: GoogleCloudAnnotation) {
		return annotation!
			.boundingPoly!.vertices!.map((vertex) => this.mapToVertex(vertex))
			.filter((vertex) => vertex !== null) as Vertex[];
	}

	private mapToVertex(vertex: GoogleCloudVertex): Vertex | null {
		const { x, y } = vertex;
		if (!x || !y) {
			return null;
		}
		return new Vertex(x, y);
	}

	private mapToTextAnnotations(response: GoogleCloudAnnotationResponse): TextAnnotation[] {
		if (!response.textAnnotations) {
			return [];
		}
		return response.textAnnotations.map((textAnnotation) =>
			this.mapToTextAnnotation(textAnnotation),
		);
	}

	private mapToTextAnnotation(textAnnotation: GoogleCloudEntityAnnotation) {
		return new TextAnnotation(textAnnotation.description ?? "");
	}
}
