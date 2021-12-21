import AnnotatedImage from "../models/AnnotatedImage";

export default interface IImageAnnotationFoundationService {
	annotateImage(file: Buffer): Promise<AnnotatedImage>;
}
