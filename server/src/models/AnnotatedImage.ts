import BoundingBox from "./BoundingBox";
import TextAnnotation from "./TextAnnotation";

export default class AnnotatedImage {
	public readonly file: Buffer;
	public readonly faceAnnotations: BoundingBox[];
	public readonly logoAnnotations: BoundingBox[];
	public readonly textAnnotations: TextAnnotation[];

	constructor(
		file: Buffer,
		faceAnnotations: BoundingBox[] = [],
		logoAnnotations: BoundingBox[] = [],
		textAnnotations: TextAnnotation[] = [],
	) {
		this.file = file;
		this.faceAnnotations = faceAnnotations;
		this.logoAnnotations = logoAnnotations;
		this.textAnnotations = textAnnotations;
	}
}
