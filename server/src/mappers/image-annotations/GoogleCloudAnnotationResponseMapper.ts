import {
	GoogleCloudAnnotation,
	GoogleCloudAnnotationResponse,
	GoogleCloudEntityAnnotation,
	GoogleCloudVertex,
} from "../../types/GoogleCloudTypes";
import BufferedFile from "../../models/common/files/BufferedFile";
import AnnotatedImage from "../../models/image-annotations/AnnotatedImage";
import BoundingPolygon from "../../models/common/geometry/BoundingPolygon";
import TextAnnotation from "../../models/image-annotations/TextAnnotation";
import Vertex from "../../models/common/geometry/Vertex";

export default class GoogleCloudAnnotationResponseMapper {
	mapToAnnotatedImage(
		{ content }: BufferedFile,
		response: GoogleCloudAnnotationResponse,
	): AnnotatedImage {
		return new AnnotatedImage(
			content,
			this.mapToBoundingBoxes(response.faceAnnotations),
			this.mapToBoundingBoxes(response.logoAnnotations),
			this.mapToTextAnnotations(response),
		);
	}

	private mapToBoundingBoxes(
		annotations: GoogleCloudAnnotation[] | null | undefined,
	): BoundingPolygon[] {
		if (!annotations) {
			return [];
		}
		return annotations.map((annotation) => this.mapToBoundingBox(annotation));
	}

	private mapToBoundingBox(annotation: GoogleCloudAnnotation): BoundingPolygon {
		if (!annotation.boundingPoly || !annotation.boundingPoly.vertices) {
			return new BoundingPolygon([]);
		}
		return new BoundingPolygon(this.mapAndFilterVertices(annotation));
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
