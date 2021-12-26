import BoundingBox from "./BoundingBox";
import TextAnnotation from "./TextAnnotation";

export default class AnnotatedImage {
	public readonly content: Buffer;
	public readonly faceAnnotations: BoundingBox[];
	public readonly logoAnnotations: BoundingBox[];
	public readonly textAnnotations: TextAnnotation[];

	constructor(
		content: Buffer,
		faceAnnotations: BoundingBox[] = [],
		logoAnnotations: BoundingBox[] = [],
		textAnnotations: TextAnnotation[] = [],
	) {
		this.content = content;
		this.faceAnnotations = faceAnnotations;
		this.logoAnnotations = logoAnnotations;
		this.textAnnotations = textAnnotations;
	}
}
