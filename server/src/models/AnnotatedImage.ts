import FaceAnnotation from "./FaceAnnotation";
import LogoAnnotation from "./LogoAnnotation";
import TextAnnotation from "./TextAnnotation";

export default class AnnotatedImage {
	public readonly file: Buffer;
	public readonly faceAnnotations: FaceAnnotation[];
	public readonly logoAnnotations: LogoAnnotation[];
	public readonly textAnnotations: TextAnnotation[];

	constructor(
		file: Buffer,
		faceAnnotations: FaceAnnotation[] = [],
		logoAnnotations: LogoAnnotation[] = [],
		textAnnotations: TextAnnotation[] = []
	) {
		this.file = file;
		this.faceAnnotations = faceAnnotations;
		this.logoAnnotations = logoAnnotations;
		this.textAnnotations = textAnnotations;
	}
}
