import AnnotatedImage from "../models/AnnotatedImage";

export interface IImageAnnotationFoundationService {
	annotateImage(file: Buffer): Promise<AnnotatedImage>;
}
