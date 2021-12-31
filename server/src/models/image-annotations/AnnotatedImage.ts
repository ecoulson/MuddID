import BoundingPolygon from "../common/geometry/BoundingPolygon";
import TextAnnotation from "./TextAnnotation";

export default class AnnotatedImage {
	public readonly content: Buffer;
	public readonly faceAnnotations: BoundingPolygon[];
	public readonly logoAnnotations: BoundingPolygon[];
	public readonly textAnnotations: TextAnnotation[];

	constructor(
		content: Buffer,
		faceAnnotations: BoundingPolygon[] = [],
		logoAnnotations: BoundingPolygon[] = [],
		textAnnotations: TextAnnotation[] = [],
	) {
		this.content = content;
		this.faceAnnotations = faceAnnotations;
		this.logoAnnotations = logoAnnotations;
		this.textAnnotations = textAnnotations;
	}
}
